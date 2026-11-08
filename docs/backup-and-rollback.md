# Backup and rollback procedure

1. In the running app, export a full JSON backup.
2. Keep at least two copies outside the Git repository, preferably encrypted and on separate storage.
3. Record which application version created the backup.
4. Before testing an import, duplicate the backup and test with the duplicate.
5. For rollback, restore the previous HTML release and import the last known-good JSON backup.
6. Never commit the backup, reports or CSV exports.
7. Knowledge updates are independent of personal records; restoring a knowledge package must not reset localStorage.
