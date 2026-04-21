import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TestApp API",
      version: "1.0.0",
      description: "API documentation for TestApp",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  // When deployed with `client/` as the project root, routes live in ./server/routes
  apis: ["./server/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
