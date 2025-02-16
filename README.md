Instructions

First install Redis if you have not already done so.
To do this, please open your Ubuntu console (if not already installed, please download it from the Windows App store) and enter the following commands: 

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update

sudo apt-get install redis

sudo service redis-server start


MongoDB Installation 

Now you have to install MongoDB. You can find the installation for this under the following link: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.4-signed.msi

During the installation, you can always click on continue and the already filled out fields will fit

Now open your CMD and but enter the Following Commands(before you enter the commands please check if the memory location of mongo db is the same as specified there, if not please change the memory location):

cd C:\Program Files\MongoDB\Server\8.0\bin       //From MongoDB onwards it should look itdenic for you

Now go to C:\Program Files\MongoDB\Server\8.0\log and delete the file in this folder

Now go back to Cmd and Enter:
mongod --install --serviceName "MongoDB" --dbpath "C:\Program Files\MongoDB\Server\8.0\data" --logpath "C:\Program Files\MongoDB\Server\8.0\log\mongod.log" --logappend


start Webpage

Finally, open the frontend folder as well as the backend folder in the terminal and enter “npm start” in both folders.
