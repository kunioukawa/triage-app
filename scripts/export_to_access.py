"""
patients.json（完了分）→ ACCESS取込用CSV エクスポートスクリプト

【使い方】
1. このスクリプトを実行: python scripts/export_to_access.py
2. data/export/questionnaire_YYYYMMDD.csv が生成される
3. ACCESSのVBAマクロでそのCSVを [問診] テーブルに取り込む

【出力CSV列】
患者ID, 氏名, 来院目的, 問診JSON, 完了時刻
"""

import csv
import json
import os
from datetime import date, datetime

DATA_DIR = os.environ.get("DATA_DIR", os.path.join(os.path.dirname(__file__), "..", "data"))
EXPORT_DIR = os.path.join(DATA_DIR, "export")
PATIENTS_FILE = os.path.join(DATA_DIR, "patients.json")


def export_completed():
    with open(PATIENTS_FILE, encoding="utf-8") as f:
        patients = json.load(f)

    completed = [p for p in patients if p.get("status") == "完了" and p.get("questionnaire")]
    if not completed:
        print("完了済みの問診がありません")
        return

    today = date.today().strftime("%Y%m%d")
    out_path = os.path.join(EXPORT_DIR, f"questionnaire_{today}.csv")

    with open(out_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["患者ID", "氏名", "来院目的", "問診データ（JSON）", "完了時刻"])
        for p in completed:
            q = p["questionnaire"]
            writer.writerow([
                p["id"],
                p["name"],
                q.get("type_label", q.get("type", "")),
                json.dumps(q, ensure_ascii=False),
                q.get("timestamp", datetime.now().isoformat()),
            ])

    print(f"エクスポート完了: {len(completed)} 名 → {out_path}")


if __name__ == "__main__":
    export_completed()
