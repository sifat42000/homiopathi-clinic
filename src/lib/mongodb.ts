import {
  MongoClient,
  ServerApiVersion,
  type Db,
} from "mongodb";

const uri = process.env.MONGODB_URI;

const databaseName =
  process.env.MONGODB_DB ||
  "homeopathy_clinic";

if (!uri) {
  throw new Error(
    "MONGODB_URI পাওয়া যায়নি। .env.local file check করুন।"
  );
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

declare global {
  var _mongoClient:
    | MongoClient
    | undefined;

  var _mongoClientPromise:
    | Promise<MongoClient>
    | undefined;
}

let mongoClient: MongoClient;

let clientPromise:
  Promise<MongoClient>;

if (
  process.env.NODE_ENV ===
  "development"
) {
  if (!global._mongoClient) {
    global._mongoClient =
      new MongoClient(
        uri,
        options
      );
  }

  mongoClient =
    global._mongoClient;

  if (
    !global._mongoClientPromise
  ) {
    global._mongoClientPromise =
      mongoClient.connect();
  }

  clientPromise =
    global._mongoClientPromise;
} else {
  mongoClient =
    new MongoClient(
      uri,
      options
    );

  clientPromise =
    mongoClient.connect();
}

export {
  mongoClient,
};

export default clientPromise;

export function getDb(): Db {
  return mongoClient.db(
    databaseName
  );
}