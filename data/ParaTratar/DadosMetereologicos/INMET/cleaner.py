import pandas as pd 
import numpy as np
from unicodedata import normalize
from os import listdir
from os.path import isfile, join

names = [f for f in listdir("./") if isfile(join("./", f))]
names.remove("cleaner.py")

rows = []
for n in names[1:]:
	print("#####", n)
	try:
		data_aux = pd.read_csv(n, sep=";")
		data_aux["Data"] = pd.to_datetime(data_aux["Data"])
		data_aux["Data"] = data_aux["Data"].dt.year
		data_aux = data_aux[data_aux["Data"] == 1998]
		data_aux["Estacao"] = n.capitalize()[:-4]
		data_aux = data_aux[["Estacao", "TempMaximaMedia", "TempCompensadaMedia", "TempMinimaMedia"]].groupby(["Estacao"]).mean()
		data_aux = data_aux.reset_index()

		dictAux = {"Estacao": data_aux.loc[0, "Estacao"], "TempMaximaMedia": data_aux.loc[0, "TempMaximaMedia"], "TempCompensadaMedia": data_aux.loc[0, "TempCompensadaMedia"], "TempMinimaMedia": data_aux.loc[0, "TempMinimaMedia"]}
		rows.append(dictAux)

	except FileNotFoundError:
		print("Nao existe")

data = pd.DataFrame(rows)
print(data)
data.to_csv("relatorio_1998.csv", sep=",", index=False)