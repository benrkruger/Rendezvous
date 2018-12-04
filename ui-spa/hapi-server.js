// Standard Node modules
const Path = require("path");

// Knex
const knex = require("knex")({
    client: "pg",
    connection: {
        host: "faraday.cse.taylor.edu",
        database: "cole_guillaume",
        user:"cole_guillaume",
        password:"nicedina"
    }
});

// Hapi
const Joi = require("joi"); // Input validation
const Hapi = require("hapi"); // Server

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, "dist")
        }
    }
});

async function init() {
    // Show routes at startup.
    await server.register(require("blipp"));

    // Output logging information.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true
        }
    });

    // Configure static file service.
    await server.register(require("inert"));

    // Configure routes.
    server.route([
        {
            method:"GET",
            path:"/api/member/{email}",
            config: {
                description: "Log in",
                validate: {
                    params: {
                        email: Joi.string()
                            .email()
                            .required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h)=>{
                let check = await knex("member/{email}")
                    .select('password')
                    .where('email',request.params.email);

                if (check[0]!=request.params.password){
                    return{
                        ok: false,
                        msge: `Login failed`
                    }
                }
                return{
                    ok:true,
                    msge:`Login sucsess`
                }
            }
        },
        /*{
            method: "PATCH",
            path:"/api/accounts",
            config: {
                description: "Sign up for an account",
                validate: {
                    payload: {
                        email: Joi.string()
                            .email()
                            .required(),
                        currentPassword: Joi.string().required(),
                        newPassword: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h) =>{
                let check = await knex("accounts")
                    .select('password')
                    .where('email',request.payload.email);
                if (check[0].password!=request.payload.currentPassword){
                    return {
                        ok: false,
                        msge: `Your current password does not match`
                    };
                }

                let rowUpdated = await knex("accounts")
                    .update('password',request.payload.newPassword)
                    .where('email',request.payload.email);
                    return {
                        ok: true,
                        msge: `All good`
                    };
            }

        },
        {
            method: "POST",
            path: "/api/accounts",
            config: {
                description: "Sign up for an account",
                validate: {
                    payload: {
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        email: Joi.string()
                            .email()
                            .required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let resultSet = await knex("accounts")
                    .select()
                    .where("email", request.payload.email);
                if (resultSet.length > 0) {
                    return {
                        ok: false,
                        msge: `The account '${request.payload.email}' is already in use`
                    };
                }

                let result = await knex("accounts").insert({
                    firstname: request.payload.firstName,
                    lastname: request.payload.lastName,
                    email: request.payload.email,
                    password: request.payload.password
                });

                if (result.rowCount === 1) {
                    return {
                        ok: true,
                        msge: `Created account '${request.payload.email}'`
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't add '${
                            request.payload.email
                        }' to the database`
                    };
                }
            }
        },
        {
            method: "GET",
            path: "/api/accounts",
            config: {
                description: "Retrieve all accounts"
            },
            handler: async (request, h) => {
                return knex("accounts").select("email", "firstname", "lastname");
            }
        },
        {
            method: "GET",
            path: "/{param*}",
            config: {
                description: "Production Application"
            },
            handler: {
                directory: {
                    path: ".",
                    redirectToSlash: true,
                    index: true
                }
            }
        }*/
    ]);

    // Start the server.
    await server.start();
    server.logger().info(`Server running at ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

// Go!
init();
