// Standard Node modules
const Path = require('path');   // Files and directories

// Hapi
const Boom = require('boom');   // Error reporting
const Joi = require('joi');     // Input validation
const Hapi = require('hapi');   // Server

// Other
const Handlebars = require('handlebars');   // Template engine

const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    routes: {
        files: {
            // Make file requests relative to the public directory.
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

async function init() {
    // Show routes at startup.
    await server.register(require('blipp'));

    // Output logging information.
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true
        }
    });

    // Configure templating.
    await server.register(require('vision'));
    server.views({
        engines: {
            hbs: Handlebars,
            html: Handlebars
        },
        isCached: false,            // Don't cache pages during development.
        defaultExtension: 'hbs',    // Most common
        relativeTo: __dirname,      // Template directory tree right here
        path: './templates',        // Top-level template directory
        layout: 'base',             // Default layout file
        layoutPath: './templates/layout',       // Location of layout file(s)
        partialsPath: './templates/partials'    // Location of partial file(s)
    });

    // Configure static file service.
    await server.register(require('inert'));

    // Configure routes.
    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                description: 'Home page'
            },
            handler: async (request, h) => {
                return h.view('index');
            }
        },


        /******START OF NEW CODE FOR RENDEZVOUS******/
        /*
        {
            method: 'GET',
            path: '/teams',
            config: {
                description: 'Teams overview page'
            },
            handler: async (request, h) => {
                return h.view('teams');
            }
        },

        {
            method: 'GET',
            path: '/my-page',
            config: {
                description: 'Member overview page'
            },
            handler: async (request, h) => {
                return h.view('my-page');
            }
        },
        
        {
            method: 'POST',
            path: '/teams',
            config: 'Handles join team request',
            payload: {
                teamName: Joi.string().required()
            }
        },
        */


        /******END OF NEW CODE FOR RENDEZVOUS******/


        /*{
            method: 'GET',
            path: '/sign-up',
            config: {
                description: 'Sign-up page'
            },
            handler: async (request, h) => {
                return h.view('sign-up.hbs');
            }
        },
        {
            method: 'GET',
            path: '/reset-password',
            config: {
                description: 'Password reset page'
            },
            handler: async (request, h) => {
                return h.view('reset-password.hbs');
            }
        },
        {
            method: 'POST',
            path: '/sign-up',
            config: {
                description: 'Handle sign-up request',
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let messages = [];
                if (!request.payload.email.match(/^\w+@\w+\.\w{2,}$/)) {
                    messages.push(`'${request.payload.email}' is an invalid email address`);
                }

                if (!request.payload.password.match(/[A-Z]/)) {
                    messages.push('Password requires at least one upper-case letter');
                }

                if (!request.payload.password.match(/[a-z]/)) {
                    messages.push('Password requires at least one lower-case letter');
                }

                if (!request.payload.password.match(/[0-9]/)) {
                    messages.push('Password requires at least one digit');
                }

                if (request.payload.password.length < 8) {
                    messages.push('Password must be at least eight characters long');
                }

                if (messages.length) {
                    return h.view('sign-up.hbs', {errors: messages})
                } else {
                    return h.view('index', {flash: ['Signed up successfully!']});
                }
            }
        },
        {
            method: 'POST',
            path: '/reset-password',
            config: {
                description: 'Handle password reset request',
                validate: {
                    payload: {
                        password: Joi.string().required(),
                        newpassword: Joi.string().required(),
                        confirmnew: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let messages = [];

                if (messages.length) {
                    return h.view('reset-password.hbs', {errors: messages})
                } else {
                    return h.view('index', {flash: ['Changed password successfully!']});
                }
            }
        },*/
        {
            method: 'GET',
            path: '/public/{param*}',
            config: {
                description: 'Public assets'
            },
            handler: {
                directory: {
                    path: '.',
                    redirectToSlash: true,
                    index: false
                }
            }
        }
    ]);

    // Start the server.
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.error(err);
    process.exit(1);
});

// Go!
init();