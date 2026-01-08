### You are an expert in web development and UI/UX design

### 
I am building an Iot Dashboard platform for BayIot company, that will serve multiple tenants, as well as allowing white labeling for each tenant.
The tenant, once signed up, will have their own domain pointing to the dashboard. The dashboard will automatically recognize the hostname and serve the appropriate content preconfigured per tenant domain/hostname.
The tenant will then be able to resell the dashboard to their customers, who will have a username and password to access the dashboard.
### 

### Tech Stack  
1. Frontend (dashboard): React, Tailwind CSS
    - Will be served by NGINX
    - Will be deployed via docker
2. Backend: Node.js, Express.js   
    - I will be using sequlize as an ORM, with model, controller, service, utils, scripts (temporary) folder structure   
    - Will be deployed via docker container
3. Database: MySQL
    - Will be deployed via docker container
4. Authentication: JWT


### Backend Design
Note: When creating models, please use sequelize and create models in model folder, as well as provide the sql script to run against the database. When creating controllers, use CRUD operations

1. Tenants
    - id (key, auto increment)
    - name (varchar)
    - domain (varchar)
    - logo (varchar)
    - theme (varchar)
    - created_at (timestamp)
    - updated_at (timestamp)

2. TenantCustomers
    - id (key, auto increment)
    - name (varchar)
    - email (varchar)
    - password (varchar)
    - role (varchar)
    - tenant_id (foreign key)
    - created_at (timestamp)
    - updated_at (timestamp)

3. TenantCustomerDevices
    - id (key, auto increment)
    - name (varchar)
    - type (varchar)
    - tenant_customer_id (foreign key)
    - created_at (timestamp)
    - updated_at (timestamp)

## Dashboard Design
1. Signin Page
    - Email
    - Password
    - Remember me
    - Forgot password
    - Sign up
    - Signin (Redirect to dashboard after succesfull api call)

2. Dashboard
    - Tenant name
    - Tenant logo
    - Tenant theme
    - Tenant device
    - Tenant users
    - Tenant settings
    - Tenant logout
3. Signup Page
    - Name
    - Email
    - Password
    - Confirm password

### Next Steps
1. The tenant will already exist, but now, i want the tenant to be able to create an account for him/her self as admin in order to manage customer dashboards.The email address domain must match the tenant domain. If this is true, then the user will be created as admin. If not, the user will be created as customer. The customer at this point, will only be able to view the dashboard and not manage it.
