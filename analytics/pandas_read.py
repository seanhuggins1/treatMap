import pandas as pd

def read_and_parse(excel_file, sheet_name):
    return pd.read_excel(excel_file)

def analyze(frames):
    pass

if __name__ == "__main__":
    analyze(read_parse('RiskLevelsDownloadableData.xlsx', 'US State Risk Level'))
