import csv
from collections import OrderedDict
from pathlib import Path

infile = Path(r"c:\Users\taclendj\Documents\GitHub\db-schema-visualizer_jak\00 Update\Test Files\EASA_tablescolumns.tsv")
outfile = infile.with_suffix(".dbml")

with infile.open("r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f, delimiter="\t")
    tables = OrderedDict()
    for row in reader:
        table_name = row["table_name"].strip()
        tables.setdefault(table_name, []).append(row)

filtered_tables = OrderedDict()
for table_name, table_rows in tables.items():
    name_upper = table_name.upper()
    if "BAK" in name_upper or "BK" in name_upper:
        continue
    if name_upper.startswith("ETL_"):
        continue
    if name_upper == "TOKENS" or name_upper == "APILOGS":
        continue
    filtered_tables[table_name] = table_rows

lines = []
for table_name, table_rows in filtered_tables.items():
    safe_name = table_name
    if any(ch.isspace() for ch in safe_name) or "." in safe_name or "-" in safe_name or "/" in safe_name:
        safe_name = f'"{table_name}"'
    lines.append(f"Table {safe_name} {{")

    for row in table_rows:
        col = row["column_name"].strip()
        dtype = row["data_type"].strip()
        max_len = row["max_length"].strip()
        precision = row["precision"].strip()
        scale = row["scale"].strip()
        nullable = row["is_nullable"].strip() == "1"

        if dtype.lower() in {"nvarchar", "varchar", "char", "nchar"}:
            if max_len and max_len not in {"-1", "0"}:
                dbml_type = f"{dtype.lower()}({max_len})"
            else:
                dbml_type = dtype.lower()
        elif dtype.lower() in {"decimal", "numeric"}:
            if precision and precision != "0":
                if scale and scale != "0":
                    dbml_type = f"{dtype.lower()}({precision},{scale})"
                else:
                    dbml_type = f"{dtype.lower()}({precision})"
            else:
                dbml_type = dtype.lower()
        elif dtype.lower() == "uniqueidentifier":
            dbml_type = "uuid"
        elif dtype.lower() == "bit":
            dbml_type = "boolean"
        else:
            dbml_type = dtype.lower()

        if any(ch.isspace() for ch in col) or "-" in col or "/" in col or "." in col:
            col_text = f'"{col}"'
        else:
            col_text = col

        if not nullable:
            lines.append(f"  {col_text} {dbml_type} [not null]")
        else:
            lines.append(f"  {col_text} {dbml_type}")

    lines.append("}")
    lines.append("")

outfile.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
print(f"Created {outfile}")
print(f"Tables: {len(filtered_tables)}")
print(f"Columns: {sum(len(v) for v in filtered_tables.values())}")
