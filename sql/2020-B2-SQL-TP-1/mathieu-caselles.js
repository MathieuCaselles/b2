const name = "mathieu-caselles"
const promo = "B2A"

const q1 = `
SELECT Name
FROM Track
WHERE Milliseconds < (SELECT Milliseconds
					  FROM Track
					  WHERE TrackId = 3457);
`
const q2 = `
SELECT Name
FROM Track
WHERE MediaTypeId = (SELECT MediaTypeId
					  FROM Track
            WHERE Name = 'Rehab');
`

const q3 = `
SELECT Playlist.PlaylistId, Playlist.Name, COUNT(PlaylistTrack.TrackId) "Nombre de chansons", CONCAT(SUM(Track.Milliseconds), 'ms') "Durée totale", CONCAT(AVG(Track.Milliseconds), 'ms') "Durée moyenne des chansons"
FROM Playlist
JOIN PlaylistTrack
	ON PlaylistTrack.PlaylistId = Playlist.PlaylistId
JOIN Track
	ON Track.TrackId = PlaylistTrack.TrackId
GROUP BY Playlist.PlaylistId, Playlist.Name;
`

const q4 = `
SELECT idPlaylist, nomPlaylist, dureeTotale
FROM
	(
	SELECT Playlist.PlaylistId idPlaylist, Playlist.Name nomPlaylist, SUM(Track.Milliseconds) dureeTotale
	FROM Playlist
	JOIN PlaylistTrack
		ON PlaylistTrack.PlaylistId = Playlist.PlaylistId
	JOIN Track
		ON Track.TrackId = PlaylistTrack.TrackId
	GROUP BY Playlist.PlaylistId, Playlist.Name
	) TableReponseTotal
WHERE dureeTotale > (SELECT AVG(cast(dureeTotale as numeric (12, 0)))
						FROM
							(
							SELECT Playlist.PlaylistId idPlaylist, Playlist.Name nomPlaylist, SUM(Track.Milliseconds) dureeTotale
							FROM Playlist
							JOIN PlaylistTrack
								ON PlaylistTrack.PlaylistId = Playlist.PlaylistId
							JOIN Track
								ON Track.TrackId = PlaylistTrack.TrackId
							GROUP BY Playlist.PlaylistId, Playlist.Name
							) TableReponseMoyenne);
`

const q5 = `
SELECT idPlaylist, nomPlaylist, nombreChansons
FROM
	(
		SELECT Playlist.PlaylistId idPlaylist, Playlist.Name nomPlaylist, COUNT(PlaylistTrack.TrackId) nombreChansons
		FROM Playlist
		JOIN PlaylistTrack
			ON PlaylistTrack.PlaylistId = Playlist.PlaylistId
		JOIN Track
			ON Track.TrackId = PlaylistTrack.TrackId
		GROUP BY Playlist.PlaylistId, Playlist.Name
	) TableReponseTotal
	
WHERE nombreChansons IN	(SELECT COUNT(PlaylistTrack.TrackId) "Nombre de chansons"
														FROM Playlist
														JOIN PlaylistTrack
															ON PlaylistTrack.PlaylistId = Playlist.PlaylistId
														WHERE Playlist.PlaylistId IN (1, 13)
														GROUP BY Playlist.PlaylistId, Playlist.Name)
	AND idPlaylist NOT IN (1, 13);
`

const q6 = `
SELECT Customer.FirstName, Customer.LastName
FROM Customer
	JOIN Invoice
	ON Invoice.CustomerId = Customer.CustomerId
WHERE BillingCountry != 'France' and Total > (SELECT MAX(Total)
													FROM Invoice
													WHERE BillingCountry = 'France');
`

const q7 = `
SELECT Invoice.BillingCountry "Counrty", MIN(TOTAL) CommandeMin, MAX(Total) CommandeMax, AVG(Total) CommandeMoyen, COUNT(Invoice.InvoiceId) TotalNombreCommande, 100 * COUNT(Invoice.InvoiceId) / (SELECT COUNT(Invoice.InvoiceId)
																																																	FROM INVOICE) * 1.0 PourcentageNombreDeCommandes,  100 * SUM(Invoice.Total) / (SELECT SUM(Invoice.Total)
																																																																					FROM INVOICE) PourcentageTotalDeCommandes
FROM Invoice
GROUP BY Invoice.BillingCountry;
`

const q8 = `
SELECT track.TrackId, track.Name, track.AlbumId, track.MediaTypeId, track.GenreId, track.Composer, track.Milliseconds, track.Bytes, track.UnitPrice, (SELECT AVG(UnitPrice) FROM Track) prixMoyenGlobal, (SELECT AVG(t.UnitPrice) FROM Track t JOIN MediaType MediaType2 ON t.MediaTypeId = MediaType2.MediaTypeId WHERE MediaType.MediaTypeId = MediaType2.MediaTypeId GROUP BY t.MediaTypeId, MediaType2.Name) moyenneMedia
FROM track
JOIN MediaType
ON track.MediaTypeId = MediaType.MediaTypeId
WHERE track.UnitPrice > (SELECT AVG(UnitPrice) FROM Track)
`

const q9 = `
SELECT track.TrackId, track.Name, track.AlbumId, track.MediaTypeId, track.GenreId, track.Composer, track.Milliseconds, track.Bytes, track.UnitPrice, genre.Name nomGenre, (SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY track.UnitPrice) OVER (PARTITION BY genre2.Name) medianMedia FROM Track JOIN Genre genre2  ON track.GenreId = genre2.GenreId WHERE genre.genreId = genre2.GenreId GROUP BY track.genreId, genre2.Name, track.UnitPrice) medianMedia
FROM track
JOIN genre
ON track.GenreId = genre.GenreId
WHERE track.UnitPrice < (SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY track.UnitPrice) OVER (PARTITION BY genre2.Name) medianMedia FROM Track JOIN Genre genre2 ON track.GenreId = genre2.GenreId WHERE genre.genreId = genre2.GenreId GROUP BY track.genreId, genre2.Name, track.UnitPrice)
`

const q10 = `
SELECT PlaylistTrack.playlistId, album.artistId, 
                        (SELECT COUNT(DISTINCT album2.artistId)
                        FROM PlaylistTrack PlaylistTrack2 
                        JOIN Track
                        ON Track.TrackId = PlaylistTrack2.TrackId 
                        JOIN album album2
                        ON album2.albumid = Track.albumId 
                        WHERE PlaylistTrack.playlistId = PlaylistTrack2.playListId 
                        GROUP BY PlaylistTrack2.PlaylistId) nbArtistPlayList,
                        (SELECT COUNT(DISTINCT Track.trackId)
                        FROM playlisttrack PlaylistTrack2
                        JOIN Track 
                        ON Track.TrackId = PlaylistTrack2.TrackId 
                        JOIN album album3
                        ON album3.albumid = Track.albumId
                        WHERE album.ArtistId = album3.artistId
                        GROUP BY album3.artistId) nbChansonArtist,
                        (SELECT AVG(Track.UnitPrice) nbArtistes
                        FROM PlaylistTrack PlaylistTrack2
                        JOIN Track
                        ON Track.TrackId = PlaylistTrack2.TrackId 
                        JOIN album album3
                        ON album3.albumid = Track.albumId
                        WHERE album.ArtistId = album3.artistId
                        GROUP BY album3.artistId) moyenneTrackPrince,
                        (SELECT MAX(nbArtist.nbArtistPlaylist)
                        FROM
                        (
                        SELECT COUNT(DISTINCT album2.artistId) nbArtistPlaylist
                        FROM playlisttrack PlaylistTrack2 
                        JOIN Track
                        ON Track.TrackId = PlaylistTrack2.TrackId 
                        JOIN album album2
                        ON album2.albumid = Track.albumId 
                        GROUP BY PlaylistTrack2.PlaylistId
                        ) nbArtist) amaxArtistPlaylist 
FROM PlaylistTrack PlaylistTrack
JOIN Track
ON Track.TrackId = PlaylistTrack.TrackId 
JOIN album
ON album.albumid = Track.albumId 
`

const q11 = `
SELECT pays.Country Pays, COUNT(pays.country) Total
FROM
(
SELECT Employee.Country
FROM Employee
UNION ALL
SELECT Customer.Country
FROM Customer
UNION ALL
SELECT Invoice.BillingCountry
FROM Invoice
) pays
GROUP BY pays.Country;
`

const q12 = `
SELECT pays.Country Pays, COUNT(pays.country) Total,
                    ISNULL((SELECT COUNT(country)
                    FROM Employee
                    WHERE pays.country = Country
                    GROUP BY Country), 0) Employee,
                    (SELECT COUNT(country)
                    FROM Customer
                    WHERE pays.country = Country
                    GROUP BY Country) Customer, 
                    (SELECT COUNT(Billingcountry)
                    FROM Invoice
                    WHERE pays.Country = BillingCountry
                    GROUP BY BIllingCountry) Invoice

FROM
(
SELECT Employee.Country
FROM Employee
UNION ALL
SELECT Customer.Country
FROM Customer
UNION ALL
SELECT Invoice.BillingCountry
FROM Invoice
) pays
GROUP BY pays.Country;
`

const q13 = `
SELECT DISTINCT Invoice.InvoiceId
FROM 
	(
		SELECT MAX(Track.Milliseconds) dureeMaxTrack
		FROM Genre
		JOIN Track
			ON Track.GenreId = Genre.GenreId
		GROUP BY Genre.Name
	) tableMaxGenre
JOIN Track 
	ON tableMaxGenre.dureeMaxTrack = Track.Milliseconds
JOIN InvoiceLine
	ON Track.TrackId = InvoiceLine.TrackId
JOIN Invoice
	ON InvoiceLine.InvoiceId = Invoice.InvoiceId;
`

const q14 = `
SELECT Invoice.InvoiceId, AVG(Track.UnitPrice) coutMoyenChanson, SUM(Track.Milliseconds) TempsTotalChansonEnMS, Invoice.Total/SUM(Track.Milliseconds/1000) coutParSecondes
FROM Invoice
JOIN InvoiceLine
	ON Invoice.InvoiceId = InvoiceLine.InvoiceId
JOIN Track
	ON InvoiceLine.TrackId = Track.TrackId
GROUP BY Invoice.InvoiceId, Invoice.Total;
`

const q15 = `
SELECT Employee.LastName, Employee.FirstName, COUNT(EmployeeId) nbrVente
FROM Employee
JOIN Customer
	ON Employee.EmployeeId = Customer.SupportRepId
JOIN Invoice
	ON Customer.CustomerId = Invoice.CustomerId
GROUP BY Employee.LastName, Employee.FirstName;
`

const q16 = `
SELECT resultat.LastName, resultat.FirstName
FROM
	(
		SELECT TOP 3 Employee.LastName, Employee.FirstName, COUNT(Employee.EmployeeId) nbrVente
	FROM Employee
	JOIN Customer
		ON Employee.EmployeeId = Customer.SupportRepId
	JOIN Invoice
		ON Customer.CustomerId = Invoice.CustomerId
	GROUP BY Employee.LastName, Employee.FirstName
	ORDER BY nbrVente DESC
	)resultat
WHERE resultat.nbrVente = (	SELECT MIN(resultat2.nbrVente)
							FROM
							(
								SELECT TOP 3 Employee.LastName, Employee.FirstName, COUNT(EmployeeId) nbrVente
								FROM Employee
								JOIN Customer
									ON Employee.EmployeeId = Customer.SupportRepId
								JOIN Invoice
									ON Customer.CustomerId = Invoice.CustomerId
								GROUP BY Employee.LastName, Employee.FirstName
								ORDER BY nbrVente DESC
							)resultat2);
`

const q17 = `
SELECT playlistId, ((SELECT COUNT(Track.trackId) numberOfTrack2Min
                    FROM Playlist
                    JOIN PlaylistTrack
                    ON Playlist.PlaylistId = PlaylistTrack.PlaylistId
                    JOIN Track
                    ON PlaylistTrack.TrackId = Track.TrackId
                    WHERE Track.TrackId IN (SELECT Track.TrackId
                                      FROM InvoiceLine
                                      JOIN Track
                                      ON InvoiceLine.TrackId = Track.TrackId
                                      GROUP BY Track.trackId
                                      HAVING COUNT(InvoiceLine.trackId) = 2)
                    AND PlaylistReference.PlaylistId = Playlist.PlaylistId
                    GROUP BY Playlist.PlaylistId) / CAST((SELECT COUNT(PlaylistTrack.PlaylistId) numberOfTrack
                                                FROM Playlist
                                                JOIN PlaylistTrack
                                                ON Playlist.PlaylistId = PlaylistTrack.PlaylistId
                                                JOIN track
                                                ON track.TrackId = PlaylistTrack.TrackId
                                                WHERE PlaylistReference.PlaylistId = Playlist.playlistId
                                                GROUP BY Playlist.PlaylistId) as numeric(12,0)))*100 pourcentageVenduMin2Fois
FROM Playlist PlaylistReference;
`

const q18 = `
IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'Bddtp')
BEGIN
	ALTER DATABASE [Bddtp] SET OFFLINE WITH ROLLBACK IMMEDIATE;
	ALTER DATABASE [Bddtp] SET ONLINE;
	DROP DATABASE [Bddtp];
END

CREATE DATABASE [Bddtp];
GO

USE [Bddtp];
GO

CREATE TABLE [dbo].[User] (
	id int IDENTITY(1,1) primary key NOT NULL,
	username varchar(255),
	email varchar(255),
	superuser bit
);
GO
CREATE TABLE [dbo].[Group] (
	id int IDENTITY(1,1) primary key NOT NULL,
	name varchar(255),
	display_name varchar(255),
	description varchar(255)
);
GO
CREATE TABLE [dbo].[User_Group] (
	user_id int FOREIGN KEY REFERENCES [User](id) NOT NULL,
	group_id int FOREIGN KEY REFERENCES [Group](id) NOT NULL,
);
GO
CREATE TABLE [dbo].[Role] (
	id int IDENTITY(1,1) primary key NOT NULL,
	name varchar(255),
	display_name varchar(255),
	description varchar(255)
);
GO
CREATE TABLE [dbo].[Group_Role] (
	group_id int FOREIGN KEY REFERENCES [Group](id) NOT NULL,
	role_id int FOREIGN KEY REFERENCES [Role](id) NOT NULL,
);
GO
CREATE TABLE [dbo].[User_Role] (
	user_id int FOREIGN KEY REFERENCES [User](id) NOT NULL,
	role_id int FOREIGN KEY REFERENCES [Role](id) NOT NULL,
);
GO
CREATE TABLE [dbo].[Permission] (
	id int IDENTITY(1,1) primary key NOT NULL,
	name varchar(255),
	display_name varchar(255),
	description varchar(255)
);
GO
CREATE TABLE [dbo].[Role_Permission] (
	role_id int FOREIGN KEY REFERENCES [Role](id) NOT NULL,
	permission_id int FOREIGN KEY REFERENCES Permission(id) NOT NULL,
);
GO
`

const q19 = `
INSERT INTO Track (Name, MediaTypeId, Milliseconds, UnitPrice)
 VALUES
 ('Musique1', 1, 36, 5),
 ('Musique2', 1, 6, 8),
 ('Musique3', 1, 360, 1);
`

const q20 = `
INSERT INTO Employee (LastName, FirstName, Country)
 VALUES
 ('Feydit', 'Rémi', 'France'),
 ('Durand', 'Antoine', 'France');
`

const q21 = `
ALTER TABLE InvoiceLine NOCHECK CONSTRAINT FK_InvoiceLineInvoiceId;

DELETE FROM Invoice
WHERE CONVERT(VARCHAR(10), InvoiceDate, 120) LIKE '2010%';

ALTER TABLE InvoiceLine CHECK CONSTRAINT FK_InvoiceLineInvoiceId;
`

const q22 = `
UPDATE Invoice
SET CustomerId = (
    SELECT TOP 1 Customer.CustomerId
    FROM Customer
    JOIN Invoice
    ON Customer.CustomerId = Invoice.CustomerId
    WHERE Customer.Country = 'France'
    GROUP BY Customer.CustomerId
    HAVING COUNT(InvoiceId) = (SELECT MAX(resultat.nbrClientFr) clientMax
                         FROM 
                         (SELECT Customer.CustomerId, COUNT(Customer.CustomerId) nbrClientFr
                         FROM Customer
                         JOIN Invoice
                         ON Customer.CustomerId = Invoice.CustomerId
                         WHERE Customer.Country = 'France'
                         GROUP BY Customer.CustomerId
                         ) resultat)
)
WHERE BillingCountry = 'Germany' AND InvoiceDate BETWEEN '2011-01-02 00:00:00.000' AND '2014-01-01 00:00:00.000';
`

const q23 = `
UPDATE Invoice
SET Invoice.BillingCountry = Customer.Country
FROM Invoice
JOIN Customer
ON Customer.CustomerId = Invoice.InvoiceId
WHERE Invoice.BillingCountry != Customer.Country
`

const q24 = `
ALTER TABLE dbo.Employee ADD Salary int NULL;
`

const q25 = `
UPDATE dbo.Employee
SET Salary = FLOOR((RAND(CHECKSUM(NEWID())) * 70000) + 30000)
`

const q26 = `ALTER TABLE Invoice DROP COLUMN BillingPostalCode`











































// NE PAS TOUCHER CETTE SECTION
const tp = {name: name, promo: promo, queries: [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26]}
module.exports = tp
