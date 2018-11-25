import pandas as pd 
import numpy as np 

try:
	data1 = pd.read_csv("idh.csv", sep=",")
	data2 = pd.read_csv("municipios_1991.csv", sep=",")

	data1 = data1.drop("Multiplicador", axis=1)
	data1 = data1.drop("Unidade", axis=1)
	data1 = data1.drop("A", axis=1)
	data1 = data1.drop("id", axis=1)

	data2 = data2.drop("id", axis=1)
	data2 = data2.drop("ano", axis=1)

	newData = pd.merge(data1, data2, on="Nome")

	newData["1991"] = np.round(newData["1991"], 3)
	newData["2000"] = np.round(newData["2000"], 3)
	newData["2010"] = np.round(newData["2010"], 3)

	newData.to_csv("chuva_vs_idhm_1991.csv", columns=["Nome", "chuva_total", "1991"], sep=",", index=False)
	newData.to_csv("chuva_vs_idhm_2000.csv", columns=["Nome", "chuva_total", "2000"], sep=",", index=False)
	newData.to_csv("chuva_vs_idhm_2010.csv", columns=["Nome", "chuva_total", "2010"], sep=",", index=False)

except FileNotFoundError:
	print("Arquivo inexistente")