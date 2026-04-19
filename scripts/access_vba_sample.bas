' ========================================================
' MS ACCESS VBA マクロ サンプル
' [受付] テーブル → CSV出力 / 問診CSV → テーブル取込
'
' NASの共有フォルダパスを NAS_DATA_PATH に設定してください
' 例: "\\192.168.1.100\docker\triage-app\data\"
' ========================================================

Const NAS_DATA_PATH As String = "\\192.168.1.XXX\docker\triage-app\data\"

' --------------------------------------------------------
' 朝の操作: 本日の受付患者をCSVに出力する
' --------------------------------------------------------
Sub ExportPatientsToCSV()
    Dim today As String
    today = Format(Date, "YYYYMMDD")

    Dim csvPath As String
    csvPath = NAS_DATA_PATH & "import\patients_" & today & ".csv"

    ' TransferTextでCSV出力（事前にエクスポート定義を作成するか列を直接指定）
    DoCmd.TransferText acExportDelim, , "受付_本日", csvPath, True

    MsgBox "患者CSVを出力しました:" & vbCrLf & csvPath, vbInformation
End Sub

' --------------------------------------------------------
' 夕の操作: 問診完了CSVを [問診結果] テーブルに取り込む
' --------------------------------------------------------
Sub ImportQuestionnaireFromCSV()
    Dim today As String
    today = Format(Date, "YYYYMMDD")

    Dim csvPath As String
    csvPath = NAS_DATA_PATH & "export\questionnaire_" & today & ".csv"

    If Dir(csvPath) = "" Then
        MsgBox "問診CSVが見つかりません:" & vbCrLf & csvPath, vbExclamation
        Exit Sub
    End If

    ' 既存の当日データを削除してから取り込む場合
    ' CurrentDb.Execute "DELETE FROM 問診結果 WHERE 日付 = Date()"

    DoCmd.TransferText acImportDelim, , "問診結果", csvPath, True

    MsgBox "問診データを取り込みました:" & vbCrLf & csvPath, vbInformation
End Sub
