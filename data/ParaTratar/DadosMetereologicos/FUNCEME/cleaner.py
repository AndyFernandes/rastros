import pandas as pd 

names = []
for i in range(1,855):
	try:
		with open(str(i)+".txt", "r") as file:
			lines = file.readlines()
			line = lines[1]
			
			columns = line.split(';')

			if(columns[0].lower() == "barbalha"):
				print(i)

			# name = columns[0].lower()+"_0"
			# while(name in names):
			# 	print(i)
			# 	name = name[:-1] + str(int(name[-1])+1)

			# names.append(name)

	except FileNotFoundError:
		print("Arquivo",i,"inexistente")

for city in sorted(names):
	print(city)