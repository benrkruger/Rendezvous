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
            method:"POST",
            path:"/api/member/",
            config: {
                description: "Log in/ Change Core Hours",
                validate: {
                    payload: {
                        email: Joi.string()
                            .email()
                            .required(),
                        password: Joi.string().required(),
                        coreStart: Joi.string().required(),
                        coreEnd: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h)=>{
                if (request.payload.coreEnd=="null"){
                    let check = await knex("member")
                        .select("password")
                        .where("email",request.payload.email);

                    if (check[0].password!=request.payload.password){
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
                let hours = await knex("member")
                    .select("corestart","coreend")
                    .where("email",request.payload.email)
                    .update({
                        corestart: request.payload.coreStart,
                        coreend: request.payload.coreEnd,
                    });

                let core = await knex("member")
                    .select()
                    .where("email",request.payload.email)

                    return core
            }
        },
        {
            method:"POST",
            path:"/api/team/",
            config: {
                description: "Create Team",
                validate: {
                    payload: {
                        teamName: Joi.string().required()
                    }
                }
            },
            handler: async (request, h)=>{
                let insert= await knex("team")
                    .insert({teamname: request.payload.teamName});
                return{
                    ok:true,
                    msge:`Creation was a sucsess`
                }
            }
        },
        {
            method:"POST",
            path:"/api/memberteams/",
            config: {
                description: "Join Team",
                validate: {
                    payload: {
                        teamName: Joi.string().required(),
                        email: Joi.string().required()
                    }
                }
            },
            handler: async (request, h)=>{
                if (request.payload.teamName=="null"){
                    let teams= await knex("memberteams")
                    .select("teamname")
                    .where ("email",request.payload.email);

                    return teams
                }
                let check = await knex("memberteams")
                    .insert({
                        teamname: request.payload.teamName,
                        email: request.payload.email,
                    })
                return{
                    ok:true,
                    msge:`Joining was a sucsess`
                }
            }
        },
        {
            method:"POST",
            path:"/api/commitments/",
            config: {
                description: "Show Commitments",
                validate: {
                    payload: {
                        email: Joi.string().required(),
                        name: Joi.string().required(),
                        starttime: Joi.string().required(),
                        endtime: Joi.string().required(),
                        date: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h)=>{
                if (request.payload.name=="null"){
                    let commitments= await knex("commitments")
                    .select("name","starttime","endtime","date")
                    .where ("email",request.payload.email);

                    return commitments
                }

                let commitment= await knex("commitments")
                    .insert({
                        name: request.payload.name,
                        starttime: request.payload.starttime,
                        date: request.payload.date,
                        email: request.payload.email,
                        endtime: request.payload.endtime,
                    })

                return{
                    ok:true,
                    msge:`Joining was a sucsess`
                }

            }
        },
       /* {
            method:"GET",
            path:"/api/memberteams/",
            config: {
                description: "Request Team Names",
                validate: {
                    params: {
                        member: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h)=>{
                console.log('TEAM Member: ' + request.params.member)
                let teams = await knex("memberteams")
                    .select("teamname")
                    .where ("email",request.params.member)
                console.log(teams)
                console.log('AFSADFASDFSDAFASDFDSAFASDFSADFSDFASDFASDFASDFSDAFASDFDSAFASDFASDFSDAFASDZF')
                return{
                    teams
                }
            }
        },*/
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
