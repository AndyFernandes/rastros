import pandas as pd

data = pd.read_csv("quadras_anuais.csv", sep=',')

rows = []
for i in range(0,45):
	dict_aux = {}
	dict_aux["Ano"] = data.iloc[i,0]
	dict_aux["Quadra Chuvosa"] = 1
	dict_aux["Total"] = round(data.iloc[i,1], 2)

	rows.append(dict_aux)

	dict_aux2 = {}
	dict_aux2["Ano"] = data.iloc[i,0]
	dict_aux2["Quadra Chuvosa"] = 0
	dict_aux2["Total"] = round(data.iloc[i,2], 2)

	rows.append(dict_aux2)
	
data2 = pd.DataFrame(rows, columns=["Ano", "Quadra Chuvosa", "Total"])
# print(data2)
data2.to_csv('quadras_anuais.csv', index=False)