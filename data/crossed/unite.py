import pandas as pd 
import numpy as np 

try:
	data1 = pd.read_csv("areacolhida_ceara.csv", sep=",")
	data2 = pd.read_csv("quadras_anuais.csv", sep=",")

	data2.set_index('Ano', inplace=True)

	data1 = data1[["Data","Produto","Area Colhida (hct)","Area Colhida (log(hct))"]]
	data1 = data1.groupby(["Data"], as_index=False)["Area Colhida (hct)"].sum()

	data1["Quadra Chuvosa"] = 0
	data1["Restante do Ano"] = 0
	data1["Colheita Total"] = 0
	data1["Precipitacao Total"] = 0

	data1 = data1.groupby(["Data"], as_index=False)["Area Colhida (hct)"].sum()

	for i in range(1990,2018):
		data1.loc[data1["Data"]==i, "Quadra Chuvosa"] = data2.loc[i, "Quadra Chuvosa"]
		data1.loc[data1["Data"]==i, "Restante do Ano"] = data2.loc[i, "Restante do Ano"]
		data1.loc[data1["Data"]==i, "Precipitacao Total"] = data2.loc[i, "Total"]

	print(data1)

	data1.to_csv("agricultura_vs_chuva.csv", sep=",", index=False)

except FileNotFoundError:
	print("Arquivo inexistente")