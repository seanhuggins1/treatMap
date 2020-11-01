import pandas as pd
import sys
import json

output = {}

def read_and_parse(excel_file, sheet_name):
    return pd.read_excel(excel_file, sheet_name=sheet_name)

def analyze(frames, date, col):
    write_into_text(frames[frames[date].isin(['Red', 'Orange', 'Yellow', 'Green'])][[col, date]], col, date)

def write_into_text(data, col, date):
    for i, row in data.iterrows():
        output[row[col]] = row[date]

if __name__ == "__main__": 
    date = '2020-10-29'
    
    # change data_loc to the location of the data
    data_loc = "C:\\Users\\sunil\\Downloads\\RiskLevelsDownloadableData.xlsx"

    analyze(read_and_parse(data_loc, 'Country Risk Level'), date, 'Country')
    analyze(read_and_parse(data_loc, 'US State Risk Level'), date, 'State')
    #analyze(read_and_parse(data_loc, 'US Congressional District'), date, 'District')
    analyze(read_and_parse(data_loc, 'US County Risk Level'), date, 'County')

    json.dump(output, open('combined_data.json', 'w'))