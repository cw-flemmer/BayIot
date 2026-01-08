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

2. Only 1 admin can exist per tenant. If the tenant tries to create another admin, reject the request and notify the user that only 1 admin can exist per tenant. This also prevents fraudulent account creation.

3. The tenant, after registering the admin account, can now upload the tenant logo and theme under the settings page. The logo url will be stored in the database and the theme will be stored in the database as well. The logo will be stored in the nginx container in the /usr/share/nginx/html/images folder.

4. Settings Page
       - Create a tabbed panel for the settings page with the following tabs:
       - General (Upload logo, and specify theme)
       - Customers and Access (Manage customers and access)    
5. Dashboards
    -    Add a new sidebar menu for admin (Dashboards)
    -    Create a new page for dashboards (Dashboards), review the @Dashboard.PNG in ref folder. Design a similar layout. When the new button is clicked, show a modal with the form to create a new dashboard. The form should have the following fields:
    - Name
    - Description
    - Customer (Dropdown, select from TenantCustomers)
    
6. Site-Admin
- I have manually added a new tenant customer and assigned it a role (site-admin). There will always only be 1 record in the tenants table with this role, which is me, the developer. This role will allow me to create tenants instead of having to manually add them in the database. When logging in, the site-admin will be able to create tenants.  
Adjust the signin to check for this role and allow the site-admin to create tenants as well. 
- Create a new page Tenants, then create a new sidebar menu for admin (Tenants), include all menus from the admin menu as well. The site admin has full access to all menus.
- In the Tenants page, allow viewing a list of tenants, as well as creating and editing tenants. Use a layout similarthe Dashboard page layout, but instead of displaying tenants in cards, show them in a searchable table view       

7. Site Admin Enhancements
- Each tenant must have a unique uuid. This uuid will be used to link devices to the tenant.
- When creating a tenant, generate a unique uuid for the tenant and store it in the database. I also want to be able to view the uuid in the Edit Tenant form, but it must be read only. Also, when creating the tenant, first check if a tenant with the domain, name and uuid already exists. If it does, reject the request and notify the user that a tenant with the same domain, name and uuid already exists.

8. Site Admin
- Completely remove site-admin login check in backend. Instead, create a new login page for site admin with route (/site-admin-8408), and allow the site admin to login via this page. The site admin will use credentials saved in .env file in backend. 
Then show menu as previously implemented
 
9. Customer
-  When a customer logs in, display a list of dashboards assigned to them. Use same layout as for admin dashboard, but without the sidebar menu. 

10. Admin -> Devices [COMPLETED]
- Allow admin to view a list of devices assigned to them. Use same layout as for admin dashboard. The devices (tenant_devices) is linked to the (tenants) with uuid and tenant_uuid. There is currently no device model, create one. The device model will have the following fields:
- id (key, auto increment)
- tenant_uuid (char 36) Note: Link to tenant table on uuid
- device_id (varchar)
- created_at (datetime)
- last_seen (datetime)