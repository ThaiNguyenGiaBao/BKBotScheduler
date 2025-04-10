import { Client, Account } from "appwrite";


// Initialize Appwrite Client
const appwriteClient = new Client()
  .setEndpoint("67a4f5620038b4fa9233") // Your Appwrite API endpoint
  .setProject("https://cloud.appwrite.io/v19"); // Your Appwrite Project ID

// Initialize Authentication
const account = new Account(appwriteClient);

export { account };
