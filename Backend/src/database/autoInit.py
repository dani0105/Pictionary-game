# Este archivo es un inicio rapido de la base de datos
# carga todos los procedimientos, tablas y funciones.
import psycopg2 #Conexion a PostgreSQL
from os import listdir
from os.path import isfile, join, isdir
import os

PATH = "/".join(__file__.split('/')[:-1])

#conexion a base de datos nueva en postgresql
postgresqlDB = psycopg2.connect(user = "postgres",
                                password = "dani0105",
                                host = "127.0.0.1",
                                port = "5432",
                                database = "Pictonary")
postgresqlCursor = postgresqlDB.cursor()

# lista de carpetas con el nombre FP
folders = [folder for folder in listdir(PATH) if isdir(PATH+'/'+folder) and folder.find('FP') !=-1 ]

print("Creating Database")

postgresqlCursor.execute('CREATE SCHEMA public AUTHORIZATION postgres;')
postgresqlDB.commit()

# Creacion de la base de datos 
with open(PATH+'/DatabaseSQL.sql','r') as fileContent:
    script = fileContent.read()
    postgresqlCursor.execute(script)
    postgresqlDB.commit()

# creacion de procedimientos y funciones
for folder in folders:
    for sqlFile in [sqlFile for sqlFile in listdir(PATH+'/'+folder) if isfile(PATH+'/'+folder+"/"+sqlFile) and sqlFile.find('FP') !=-1 ]:
        with open(PATH+'/'+folder+"/"+sqlFile,'r') as fileContent:
            script = fileContent.read()
            postgresqlCursor.execute(script)
            postgresqlDB.commit()

print("Database created")

postgresqlDB.close()