# 🚀 Node.js Authentication Project (Version 2) Update 2024/05/25 ✅

## ✨ What's New in Version 2

### Front-End Changes🔄

1. **Improved Security with reCAPTCHA v2**:

    - Integrated reCAPTCHA v2 functionality into the login, registration, and forgot password pages to mitigate automated bot attacks and enhance overall security.

2. **Forget Password Feature**:
    - Added a new forget password page, enabling users to reset their passwords securely.
    - Created the `reset-password.html` page to facilitate the password reset process for users who have forgotten their credentials.

### Back-End Changes🛠️

1. **Enhanced Configuration Management**:

    - Implemented the `config` package and introduced a dedicated `config` folder.
    - The `default.json` file within contains essential configurations such as SMTP settings, JWT secret key, reCAPTCHA keys, and database information.

2. **Reset Password Implementation**:

    - Developed the backend logic for the forget password feature using SHA-3 hashing tokens for enhanced security.

3. **Unified Error Handling**:

    - Streamlined error handling by creating a `display_error(res)` static function within `controller.js`.
    - This function simplifies the process of handling internal server errors and prevents code redundancy.

4. **Model Updates**:

    - Updated the `User` model to accommodate new features and ensure compatibility with the latest enhancements.

5. **Bug Fixes**:
    - Addressed various bugs and issues to improve the overall stability and reliability of the application✅

## 📦 Added Packages

-   [config](https://www.npmjs.com/package/config) - Configuration management utility for Node.js applications.
-   [nodemailer](https://www.npmjs.com/package/nodemailer) - Easy as cake e-mail sending from your Node.js applications.

## 🚧 Future Enhancements

- Implement an admin panel.
- Add email verification for registration:
    - Implement a feature to send verification codes to users' email addresses upon registration.
    - Users will need to confirm their email addresses by entering the verification code received via email.
- Enhance security measures.



## 🤝 Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## 🌟 Authors

Ali Ayoubi - [Telegram: Error772](https://t.me/Error772)

## 📧 Contact

For questions or feedback, contact aliayoubiiii7@gmail.com.