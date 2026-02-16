# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within ResolveIt, please send an email to [security@yourproject.com]. All security vulnerabilities will be promptly addressed.

Please include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

## Preferred Languages

We prefer all communications to be in English.

## Security Best Practices

When deploying ResolveIt:

1. **Environment Variables**: Never commit `.env` files or expose API keys
2. **Database**: Use strong passwords and restrict access
3. **Django Settings**: 
   - Set `DEBUG=False` in production
   - Configure proper `ALLOWED_HOSTS`
   - Use secure session cookies
4. **HTTPS**: Always use HTTPS in production
5. **Authentication**: JWT tokens should be stored securely (httpOnly cookies recommended)
6. **File Uploads**: Validate all uploaded files (handled by Cloudinary)
7. **CORS**: Configure CORS properly for your domains
8. **Regular Updates**: Keep all dependencies up to date

## Known Security Considerations

- Student roll numbers are visible only to admins and the complaint owner
- Department staff cannot see identifying student information
- College-based data isolation prevents cross-college data access
- JWT tokens expire after configured time (default: 30 minutes)

## Acknowledgments

We appreciate the security research community's efforts in keeping ResolveIt secure.
