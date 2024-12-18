# Express TypeScript Backend Setup

This is a basic backend project built using **Express** and **TypeScript**. The project uses **MongoDB**, **JWT authentication**, and is configured for AWS integration.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (or access to a MongoDB cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [AWS Account](https://aws.amazon.com/) (if you plan to use AWS features like S3)

## Getting Started

Follow these steps to set up the project:

### 1. Clone the Repository

```bash
git clone https://github.com/sameerkatija/select-suite-backend.git
cd select-suite-backend
```

### 2. Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
# or if you're using yarn
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the `.env.example` file:

```bash
cp .env.example .env
```

Edit the `.env` file with your own values:

```js
PORT=5000
JWT_SECRET="any secret"
MONGODB_URI="mongodb://your_mongo_uri"
EMAIL="example@email.com"
PASS="yzqn mksb scfc gcfs" # your Google app password
AWS_ACCESS_KEY="your_aws_access_key"
AWS_SECRET_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
BUCKET_NAME="select-suite-example"
```

- **PORT:** The port on which the backend server will run.
- **JWT_SECRET:** The secret key used for JWT authentication.
- **MONGODB_URI:** Your MongoDB URI, which can be obtained from MongoDB Atlas if you're using MongoDB in the cloud.
- **EMAIL & PASS:** Google email and app password for sending emails (if using an email service).
- **AWS_ACCESS_KEY & AWS_SECRET_KEY:** Your AWS credentials for accessing AWS services like S3. You can find these in the AWS IAM Console.
- **AWS_REGION:** Your AWS region (e.g., `us-east-1`).
- **BUCKET_NAME:** The name of your AWS S3 bucket where files will be stored.

### 4. Run the Project

Once your environment variables are set, you can run the project in development mode:

```bash
npm run dev
# or if you're using yarn
yarn dev

```

This will start the server on `http://localhost:5000` by default.

### 5. Accessing the Application

Your backend API should now be running locally. You can test it by sending requests to the appropriate endpoints. For example:

- `GET` http://localhost:5000/devTest

Refer to the `src/routes/services.ts` in the code for available routes.

### 6. Project Directory Structure

```graphql
.
├── nodemon.json               # Configuration file for Nodemon to auto-restart the server during development
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
├── src                        # Source code directory
│   ├── controllers            # Express route controllers
│   │   ├── auth.controller.ts        # Authentication-related routes
│   │   ├── candidate.controllers.ts  # Candidate-related routes
│   │   ├── employer.controller.ts   # Employer-related routes
│   │   ├── notifcation.controller.ts # Notification-related routes
│   │   ├── project.controller.ts     # Project-related routes
│   │   ├── recruiter.controllers.ts  # Recruiter-related routes
│   │   ├── s3.controllers.ts         # Routes for AWS S3 (upload, download files)
│   │   └── utils.controller.ts       # Utility routes (e.g., for helper functions)
│   ├── models                  # Database models
│   │   ├── candidate.ts            # Candidate model schema
│   │   ├── city.ts                # City model schema
│   │   ├── comment.ts             # Comment model schema
│   │   ├── country.ts             # Country model schema
│   │   ├── dynamicForm.ts         # Dynamic form model schema
│   │   ├── employeer.ts           # Employer model schema
│   │   ├── notification.ts       # Notification model schema
│   │   ├── otp.ts                # OTP model schema
│   │   ├── project.ts            # Project model schema
│   │   └── user.ts               # User model schema
│   ├── routes                   # Express route definitions
│   │   └── services.ts            # Defines API services
│   ├── server.ts                 # Main Express server setup
│   ├── types                    # TypeScript types and interfaces
│   │   └── index.d.ts             # Type definitions for global types
│   └── utils                    # Utility functions and helpers
│       ├── generatePassword.ts   # Password generation utility
│       ├── logger                # Logging utility
│       │   └── winston.ts         # Winston logger setup
│       ├── middlewares           # Middleware functions
│       │   ├── errorMiddleWare.ts # Error handling middleware
│       │   ├── socketMiddleWare.ts# Socket.io middleware
│       │   ├── validateRequest.ts # Request validation middleware
│       │   └── verifyToken.ts     # Token verification middleware
│       ├── nodeMailer            # Email sending utilities
│       │   └── mailer.ts          # NodeMailer setup and usage
│       ├── notifications         # Notification utilities
│       │   └── notification.utils.ts # Functions for handling notifications
│       ├── otpLogic.ts           # OTP generation and verification logic
│       └── validation            # Data validation utilities
│           └── zodSchema.ts      # Schema validation using Zod
├── tsconfig.json               # TypeScript configuration file

```

### 7. Additional Notes

- **Google App Password:** If you're using Google services to send emails, you'll need to create an "App Password" for your Google account if you have 2-step verification enabled. You can generate an app password here: [Google Account App Passwords.](https://myaccount.google.com/apppasswords)
- **MongoDB URI:** If you're using MongoDB locally, the URI will typically be `mongodb://localhost:27017/dbname`. For MongoDB Atlas, you can find your connection string in the Atlas dashboard.
- **AWS Configuration:** If you plan to use AWS services like S3, ensure your AWS credentials are correctly set in the `.env` file, and that your IAM user has the appropriate permissions.
