import _ from 'lodash';

export const messages = {
    validations: {
        required: () => 'This field is required.',
        invalidFormat: (obj) => `Invalid ${obj} format.`,
        passwordFormat: () =>
            'Password must be 8 to 20 characters long, with at least one uppercase letter, one number, and one symbol.'
    },
    label: {
        username: () => 'Username',
        password: () => 'Password',
        confirmPassword: () => 'Confirm Password',
        email: () => 'Email',
        phoneNumber: () => 'Phone Number',
        forgotPassword: () => 'Forgot Password',
        firstName: () => 'First Name',
        lastName: () => 'Last Name',
        dob: () => 'Date of Birth',
        gender: () => 'Gender'
    },
    button: {
        login: () => 'LOG IN',
        ok: () => 'OK',
        signup: () => "SIGN UP",
        continue: () => "Continue",
        backToHomepage: () => "Back To Homepage"
    },
    error: {
        title: {
            oops: () => 'Oops!'
        },
        message: {
            general: () => 'Something went wrong, please try again.',
            invalidAuth: () => 'Invalid email or password, please try again.'
        }
    }
};

export const transformMessage = new Proxy(
    {},
    {
        get(target, prop) {
            return {
                raw: () => prop,
                upperCase: () => _.upperCase(prop),
                lowerCase: () => _.lowerCase(prop),
                camelCase: () => _.camelCase(prop),
                kebab: {
                    upperCase: () => _.upperCase(prop).replace(' ', '-'),
                    lowerCase: () => _.lowerCase(prop).replace(' ', '-'),
                    upperFirst: () => _.capitalize(_.kebabCase(prop)),
                    capitalize: () =>
                        _.kebabCase(prop)
                            .split('-')
                            .map((v) => _.capitalize(v))
                            .join('-')
                },
                upperFirst: () => _.capitalize(prop),
                capitalize: () =>
                    _.kebabCase(prop)
                        .split('-')
                        .map((v) => _.capitalize(v))
                        .join(' ')
            };
        }
    }
);
