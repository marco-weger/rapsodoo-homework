Some considerations regarding the development:
- I used a MySQL database for simplicity, as everything was already installed with XAMPP. For the same reason, the connection is made using 'root' without a password. As you can see in 'DataBase.php', the web app can be easily adapted to any SQL-based DBMS supported by PDO.
- I did not include a foreign key link between provinces and region because the provided JSON always contains both pieces of information.
- About the INDEX of 'cases_per_province':
  - Obviously, the timestamp is the primary index since data for only one day at a time will be displayed, in descending order because it is reasonable to assume that the most recent data will be queried more frequently.
  - The second and third indexes are region and province in order to maximize the performance of the aggregated SUM().
  - Finally, the sorting by region with the most cases will be done directly in the query (the sorting time for 20 records is negligible).
- Since I have not thoroughly explored the procedures for updating the read data, I opted to execute 'INSERT' one by one using 'ON DUPLICATE KEY'. It is certainly more resource-intensive, but we can be 100% sure that the data is updated with each read.
- 