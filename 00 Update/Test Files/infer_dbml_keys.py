import csv
from collections import OrderedDict
from pathlib import Path

BASE_DIR = Path(r"c:\Users\taclendj\Documents\GitHub\db-schema-visualizer_jak\00 Update\Test Files")
TSV_PATH = BASE_DIR / "EASA_tablescolumns.tsv"
DBML_PATH = BASE_DIR / "EASA_tablescolumns.dbml"


def normalize_name(value: str) -> str:
    return value.strip().upper().replace(" ", "").replace("-", "").replace(".", "")


def singularize(value: str) -> str:
    value = normalize_name(value)
    if value.endswith("IES") and len(value) > 4:
        return value[:-3] + "Y"
    if value.endswith("ES") and len(value) > 4 and not value.endswith("SS"):
        return value[:-2]
    if value.endswith("S") and len(value) > 3 and not value.endswith("SS"):
        return value[:-1]
    return value


def table_name_to_candidates(name: str):
    norm = normalize_name(name)
    return {
        "exact": norm,
        "singular": singularize(norm),
        "plural": norm if norm.endswith("S") else norm + "S",
    }


def clean_dtype(raw_dtype: str, max_len: str, precision: str, scale: str) -> str:
    dtype = raw_dtype.strip().lower()
    if dtype in {"nvarchar", "varchar", "char", "nchar"}:
        if max_len and max_len not in {"-1", "0"}:
            return f"{dtype}({max_len})"
        return dtype
    if dtype in {"decimal", "numeric"}:
        if precision and precision != "0":
            if scale and scale != "0":
                return f"{dtype}({precision},{scale})"
            return f"{dtype}({precision})"
        return dtype
    if dtype == "uniqueidentifier":
        return "uuid"
    if dtype == "bit":
        return "boolean"
    return dtype


with TSV_PATH.open("r", encoding="utf-8", newline="") as f:
    rows = list(csv.DictReader(f, delimiter="\t"))

all_tables = OrderedDict()
for row in rows:
    table_name = row["table_name"].strip()
    if not table_name:
        continue
    name_upper = table_name.upper()
    if "BAK" in name_upper or "BK" in name_upper:
        continue
    if name_upper.startswith("ETL_"):
        continue
    if name_upper in {"TOKENS", "APILOGS"}:
        continue
    all_tables.setdefault(table_name, []).append(row)

# infer primary keys
pk_by_table = {}
for table_name, table_rows in all_tables.items():
    cols = [r["column_name"].strip() for r in table_rows]
    best = None
    best_score = 0
    for col in cols:
        col_norm = normalize_name(col)
        table_norm = normalize_name(table_name)
        table_single = singularize(table_norm)
        score = 0
        if col_norm == "ID":
            score = 10
        elif col_norm == f"{table_single}_ID":
            score = 15
        elif col_norm == f"{table_norm}_ID":
            score = 14
        elif col_norm.endswith("_ID") and singularize(col_norm[:-3]) == table_single:
            score = 12
        if score > best_score:
            best_score = score
            best = col
    if best:
        pk_by_table[table_name] = best

# Resolve normalized table names only when they identify one table.
table_aliases = {}
for table_name in all_tables:
    for alias in {normalize_name(table_name), singularize(table_name)}:
        table_aliases.setdefault(alias, set()).add(table_name)

# infer foreign keys from exact table-name prefixes
fk_refs = []
for table_name, table_rows in all_tables.items():
    cols = [r["column_name"].strip() for r in table_rows]
    for col in cols:
        col_norm = normalize_name(col)
        if not col_norm.endswith("_ID"):
            continue
        matching_tables = table_aliases.get(singularize(col_norm[:-3]), set())
        if len(matching_tables) != 1:
            continue
        target_table = next(iter(matching_tables))
        target_column = pk_by_table.get(target_table)
        if target_table != table_name and target_column:
            fk_refs.append((table_name, col, target_table, target_column))

# Deduplicate FKs by table/col pair
seen = set()
deduped = []
for table_name, col, target_table, target_column in fk_refs:
    key = (table_name, col, target_table, target_column)
    if key not in seen:
        seen.add(key)
        deduped.append((table_name, col, target_table, target_column))

# Generate DBML
lines = []
for table_name, table_rows in all_tables.items():
    safe_name = table_name
    if any(ch.isspace() for ch in safe_name) or "." in safe_name or "-" in safe_name or "/" in safe_name:
        safe_name = f'"{table_name}"'
    lines.append(f"Table {safe_name} {{")

    pk_col = pk_by_table.get(table_name)
    fk_cols = {col for table, col, _, _ in deduped if table == table_name}

    for row in table_rows:
        col_name = row["column_name"].strip()
        dtype = clean_dtype(row["data_type"], row["max_length"], row["precision"], row["scale"])
        nullable = row["is_nullable"].strip() == "1"
        annotations = []
        if col_name == pk_col:
            annotations.append("pk")
        if not nullable:
            annotations.append("not null")
        if annotations:
            lines.append(f"  {col_name} {dtype} [{', '.join(annotations)}]")
        else:
            lines.append(f"  {col_name} {dtype}")

    lines.append("}")
    lines.append("")

for table_name, col, target_table, target_column in deduped:
    safe_src = table_name
    safe_tgt = target_table
    if any(ch.isspace() for ch in safe_src) or "." in safe_src or "-" in safe_src or "/" in safe_src:
        safe_src = f'"{table_name}"'
    if any(ch.isspace() for ch in safe_tgt) or "." in safe_tgt or "-" in safe_tgt or "/" in safe_tgt:
        safe_tgt = f'"{target_table}"'
    lines.append(f"Ref: {safe_src}.{col} > {safe_tgt}.{target_column}")

DBML_PATH.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

print("Inferred PKs:")
for table_name, col in sorted(pk_by_table.items()):
    print(f"  - {table_name}: {col}")

print("\nInferred FKs:")
for table_name, col, target_table, target_column in deduped[:30]:
    print(f"  - {table_name}.{col} -> {target_table}.{target_column}")
print(f"\nTotal inferred PKs: {len(pk_by_table)}")
print(f"Total inferred FKs: {len(deduped)}")
print(f"Wrote: {DBML_PATH}")
