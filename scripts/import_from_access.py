"""
ACCESS [受付] テーブル → patients.json インポートスクリプト

【使い方】
1. ACCESSのVBAマクロで data/import/patients_YYYYMMDD.csv を出力
2. このスクリプトを実行: python scripts/import_from_access.py
3. data/patients.json が更新される

【ACCESSのCSV列（例）】
ID, 氏名, カナ, 年齢, 受付時刻, 初診フラグ
1, 山田 太郎, ヤマダ タロウ, 72, 09:00, 0
"""

import csv
import json
import os
import glob
from datetime import date

DATA_DIR = os.environ.get("DATA_DIR", os.path.join(os.path.dirname(__file__), "..", "data"))
IMPORT_DIR = os.path.join(DATA_DIR, "import")
PATIENTS_FILE = os.path.join(DATA_DIR, "patients.json")

# ACCESSのCSV列名 → JSONフィールド名のマッピング
# ご自身のACCESSテーブル列名に合わせて変更してください
COLUMN_MAP = {
    "ID":       "id",
    "氏名":     "name",
    "カナ":     "kana",
    "年齢":     "age",
    "受付時刻": "reception_time",
    "初診":     "is_new_visit",   # 0=再診, 1=初診
}


def find_latest_csv():
    today = date.today().strftime("%Y%m%d")
    pattern = os.path.join(IMPORT_DIR, f"*{today}*.csv")
    files = glob.glob(pattern)
    if not files:
        # 日付なしのファイルも探す
        files = glob.glob(os.path.join(IMPORT_DIR, "*.csv"))
    if not files:
        return None
    return max(files, key=os.path.getmtime)


def import_patients(csv_path):
    patients = []
    with open(csv_path, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            p = {
                "id":             int(row.get("ID", 0)),
                "name":           row.get("氏名", "").strip(),
                "kana":           row.get("カナ", "").strip(),
                "age":            int(row.get("年齢", 0)),
                "reception_time": row.get("受付時刻", "").strip(),
                "is_new_visit":   row.get("初診", "0").strip() == "1",
                "status":         "未対応",
                "questionnaire":  None,
            }
            patients.append(p)

    with open(PATIENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(patients, f, ensure_ascii=False, indent=2)

    print(f"インポート完了: {len(patients)} 名 → {PATIENTS_FILE}")
    return patients


if __name__ == "__main__":
    csv_path = find_latest_csv()
    if not csv_path:
        print(f"CSVファイルが見つかりません: {IMPORT_DIR}")
        raise SystemExit(1)
    print(f"読み込み: {csv_path}")
    import_patients(csv_path)
