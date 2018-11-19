import pandas as pd 
import numpy as np
from unicodedata import normalize
from os import listdir
from os.path import isfile, join

names = [f for f in listdir("cleaning/chuvas_diarias/") if isfile(join("cleaning/chuvas_diarias/", f))]
for n in names:
	print("#### " + str(n))
	try:
		data = pd.read_csv('cleaning/chuvas_diarias/'+n, sep=",")

		municipio = normalize('NFKD', data.loc[0, "Municipios"].lower()).encode('ASCII', 'ignore').decode('ASCII')

		rows = []
		for idx, row in data.iterrows():
			for i in range(1,32):
				dict_aux = {}
				dict_aux["Municipio"] = row['Municipios']
				dict_aux["Data"] = "{0:04d}-{1:02d}-{2:02d}".format(row['Ano'], row['Mes'], i)
				dict_aux["Precipitacao"] = row["Dia"+str(i)]

				rows.append(dict_aux)

		data_aux = pd.DataFrame(rows)
		data_aux.to_csv('cleaning/'+municipio+"_series.csv", sep=',', index=False)

	except FileNotFoundError:
		print("Arquivo",n,"inexistente")



# with open(str(i)+".txt", "r") as file:
# 	lines = file.readlines()
# 	line = lines[1]
	
# 	columns = line.split(';')

# 	if(columns[0].lower() == "barbalha"):
# 		print(i)

# name = columns[0].lower()+"_0"
# while(name in names):
# 	print(i)
# 	name = name[:-1] + str(int(name[-1])+1)

# names.append(name)


# for city in sorted(names):
# 	print(city)

# data = pd.read_csv("20.txt", sep=";")
# data2 = pd.read_csv("578.txt", sep=";")

# data["Data"] = data["Anos"].map(str) + "-" + data["Meses"].map(str)
# data["Data"] = pd.to_datetime(data["Data"])
# data = data.drop('Anos', axis=1); data = data.drop('Meses', axis=1)
# data = data.drop('Postos', axis=1)
# data = data.drop('Latitude', axis=1)
# data = data.drop('Longitude', axis=1)

# data2["Data"] = data2["Anos"].map(str) + "-" + data2["Meses"].map(str)
# data2["Data"] = pd.to_datetime(data2["Data"])
# data2 = data2.drop('Anos', axis=1); data2 = data2.drop('Meses', axis=1)
# data2 = data2.drop('Postos', axis=1)
# data2 = data2.drop('Latitude', axis=1)
# data2 = data2.drop('Longitude', axis=1)

# merge = pd.concat([data.replace(0, np.NaN), data2.replace(0, np.NaN)], ignore_index=True).groupby(['Municipios', 'Data'], as_index=False).mean()
# merge = merge.replace(np.NaN, 0)

# print(merge[merge.loc[:,"Data"] == "2001-01-01"])

# data = pd.read_csv(str(i)+".txt", sep=";")

# data = data.drop('Postos', axis=1)
# data = data.drop('Latitude', axis=1)
# data = data.drop('Longitude', axis=1)
# data = data.replace(888.0, np.NaN)
# data = data.replace(999.0, np.NaN)
# data.columns = data.columns.str.replace("Anos", "Ano")
# data.columns = data.columns.str.replace("Meses", "Mes")
# data['Media'] = data.loc[:,'Dia1':'Dia31'].mean(axis=1).round(2)

# data = data[data.columns.tolist()[:4] + ["Media"] + data.columns.tolist()[4:-1]]
# municipio = normalize('NFKD', data.loc[0, "Municipios"].lower()).encode('ASCII', 'ignore').decode('ASCII')

# if(municipio not in names):
# 	names.append(municipio)
# else:
# 	print("Merge: ", municipio)
# 	data_aux = pd.read_csv('cleaning/'+municipio+".csv", sep=",")

# 	merge = pd.concat([data.replace(0, np.NaN), data_aux.replace(0, np.NaN)], ignore_index=True).groupby(['Municipios', 'Ano','Mes'], as_index=False).mean()
# 	data = merge.replace(np.NaN, 0)

# 	print(data)

# data.to_csv('cleaning/'+municipio+".csv", sep=',', index=False)
