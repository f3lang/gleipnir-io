# gleipnir-io
gleipnir is an object storage for nodejs based applications and packages.

## Storage model
gleipnir is a mix of an append only and a classical file storage. It's priority lies on speed and reliability. 
It's storage model is not optimized to be rather storage efficient.

gleipnir handles the data with quite a number of files. 
At first there is the storage configuration file. This file contains the configuration of the storage as json e.g.:
````
{
    "dbVersion": 1,
    "partitionSize": "500MB",
    "objectIndexFile": "" 
    "indexes": {
        "id": ".gleipnir.id.idx"
    }
}
````