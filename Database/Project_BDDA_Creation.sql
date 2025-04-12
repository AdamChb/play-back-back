CREATE DATABASE PlayBack_BDD;
USE PlayBack_BDD;

CREATE TABLE Jeu(
   ID_jeu INT,
   nom VARCHAR(50),
   description VARCHAR(500),
   annee_creation INT,
   min_joueur INT,
   max_joueur INT,
   temps_jeu INT,
   min_temps INT,
   max_temps INT,
   min_age INT,
   rang INT,
   note DECIMAL(15,2),
   moyenne_bayes DECIMAL(15,2),
   image VARCHAR(100),
   PRIMARY KEY(ID_jeu)
);

CREATE TABLE Utilisateur(
   ID_utilisateur INT,
   pseudo VARCHAR(50),
   email VARCHAR(50),
   mot_de_passe VARCHAR(100),
   PRIMARY KEY(ID_utilisateur)
);

CREATE TABLE Evenement(
   ID_evenement INT,
   nom_session VARCHAR(100),
   nb_part_max INT,
   date_heure DATETIME,
   difficulte VARCHAR(50),
   description VARCHAR(500),
   PRIMARY KEY(ID_evenement)
);

CREATE TABLE Categorie(
   nom_categorie VARCHAR(100),
   PRIMARY KEY(nom_categorie)
);

CREATE TABLE Designer(
   nom_designer VARCHAR(50),
   PRIMARY KEY(nom_designer)
);

CREATE TABLE Artiste(
   nom_artiste VARCHAR(50),
   PRIMARY KEY(nom_artiste)
);

CREATE TABLE Editeur(
   nom_editeur VARCHAR(50),
   PRIMARY KEY(nom_editeur)
);

CREATE TABLE Jeu_Categories(
   ID_jeu INT,
   nom_categorie VARCHAR(100),
   PRIMARY KEY(ID_jeu, nom_categorie),
   FOREIGN KEY(ID_jeu) REFERENCES Jeu(ID_jeu),
   FOREIGN KEY(nom_categorie) REFERENCES Categorie(nom_categorie)
);

CREATE TABLE Jeu_Designers(
   ID_jeu INT,
   nom_designer VARCHAR(50),
   PRIMARY KEY(ID_jeu, nom_designer),
   FOREIGN KEY(ID_jeu) REFERENCES Jeu(ID_jeu),
   FOREIGN KEY(nom_designer) REFERENCES Designer(nom_designer)
);

CREATE TABLE Jeu_Artistes(
   ID_jeu INT,
   nom_artiste VARCHAR(50),
   PRIMARY KEY(ID_jeu, nom_artiste),
   FOREIGN KEY(ID_jeu) REFERENCES Jeu(ID_jeu),
   FOREIGN KEY(nom_artiste) REFERENCES Artiste(nom_artiste)
);

CREATE TABLE Jeu_Editeurs(
   ID_jeu INT,
   nom_editeur VARCHAR(50),
   PRIMARY KEY(ID_jeu, nom_editeur),
   FOREIGN KEY(ID_jeu) REFERENCES Jeu(ID_jeu),
   FOREIGN KEY(nom_editeur) REFERENCES Editeur(nom_editeur)
);

CREATE TABLE Evenement_Jeux(
   ID_jeu INT,
   ID_evenement INT,
   PRIMARY KEY(ID_jeu, ID_evenement),
   FOREIGN KEY(ID_jeu) REFERENCES Jeu(ID_jeu),
   FOREIGN KEY(ID_evenement) REFERENCES Evenement(ID_evenement)
);

CREATE TABLE Utilisateurs_Jeux(
   ID_jeu INT,
   ID_utilisateur INT,
   date_ DATETIME,
   statut VARCHAR(50),
   PRIMARY KEY(ID_jeu, ID_utilisateur, date_),
   FOREIGN KEY(ID_jeu) REFERENCES Jeu(ID_jeu),
   FOREIGN KEY(ID_utilisateur) REFERENCES Utilisateur(ID_utilisateur)
);
ALTER TABLE Utilisateurs_Jeux ADD CONSTRAINT chk_statut CHECK (statut IN ('aimé', 'essayé', 'à tester'));

CREATE TABLE Utilisateur_Evenements(
   ID_utilisateur INT,
   ID_evenement INT,
   venu BOOLEAN,
   PRIMARY KEY(ID_utilisateur, ID_evenement),
   FOREIGN KEY(ID_utilisateur) REFERENCES Utilisateur(ID_utilisateur),
   FOREIGN KEY(ID_evenement) REFERENCES Evenement(ID_evenement)
);
