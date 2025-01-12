# Admin Controller Endpoints

## Create Admin (Register)
- **Endpoint:** `POST /api/admin/create`
- **Description:** Create a new admin.
- **Request Body:**
    ```json
    {
        "name": "string",
        "lastName": "string",
        "department": "string",
        "designation": "string",
        "qualification": "string",
        "contactNumber": "string",
        "email": "string",
        "password": "string"
    }
    
- **Response:**
    - **201 Created:** Admin created successfully.
    - **400 Bad Request:** Error message.

## Get Admin 
- **Endpoint:** `GET /admin/all`
- **Description:** Retrieve all admin 


## Get Admin by ID
- **Endpoint:** `GET /admin/:id`
- **Description:** Retrieve an admin by their ID.
- **Response:**
    - **200 OK:** Admin object.
    - **404 Not Found:** Admin not found.
    - **400 Bad Request:** Error message.

## Update Admin
- **Endpoint:** `PUT /admin/:id`
- **Description:** Update an existing admin by their ID.
- **Request Body:** (Any fields to update)
    ```json
    {
        "name": "string",
        "lastName": "string",
        "department": "string",
        "designation": "string",
        "qualification": "string",
        "contactNumber": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Response:**
    - **200 OK:** Updated admin object.
    - **404 Not Found:** Admin not found.
    - **400 Bad Request:** Error message.

## Delete Admin
- **Endpoint:** `DELETE /admin/:id`
- **Description:** Delete an admin by their ID.
- **Response:**
    - **200 OK:** Admin deleted successfully.
    - **404 Not Found:** Admin not found.
    - **400 Bad Request:** Error message.
    ## Alumni Controller Endpoints

    ### Create Alumni (Register)
    - **Endpoint:** `POST /api/alumni/create`
    - **Description:** Create a new alumni.
    - **Request Body:**
        ```json
        {
            "name": "string",
            "lastName": "string",
            "department": "string",
            "rollNumber": "string",
            "graduationYear": "string",
            "degree": "string",
            "currentJobTitle": "string",
            "companyName": "string",
            "contactNumber": "string",
            "email": "string"
        }
        ```
    - **Response:**
        - **201 Created:** Alumni created successfully.
        - **400 Bad Request:** Error message.


        ## Get Alumni
- **Endpoint:** `GET /admin/all`
- **Description:** Retrieve all Alumni 

    ### Get Alumni by ID
    - **Endpoint:** `GET /alumni/:id`
    - **Description:** Retrieve an alumni by their ID.
    - **Response:**
        - **200 OK:** Alumni object.
        - **404 Not Found:** Alumni not found.
        - **400 Bad Request:** Error message.

    ### Update Alumni
    - **Endpoint:** `PUT /alumni/:id`
    - **Description:** Update an existing alumni by their ID.
    - **Request Body:** (Any fields to update)
        ```json
        {
            "name": "string",
            "lastName": "string",
            "department": "string",
            "rollNumber": "string",
            "graduationYear": "string",
            "degree": "string",
            "currentJobTitle": "string",
            "companyName": "string",
            "contactNumber": "string",
            "email": "string"
        }
        ```
    - **Response:**
        - **200 OK:** Updated alumni object.
        - **404 Not Found:** Alumni not found.
        - **400 Bad Request:** Error message.

    ### Delete Alumni
    - **Endpoint:** `DELETE /alumni/:id`
    - **Description:** Delete an alumni by their ID.
    - **Response:**
        - **200 OK:** Alumni deleted successfully.
        - **404 Not Found:** Alumni not found.
        - **400 Bad Request:** Error message.

        ## User Controller Endpoints

        ### Create User (Register)
        - **Endpoint:** `POST /api/user/create`
        - **Description:** Create a new user.
        - **Request Body:**
            ```json
            {
                "name": "string",
                "lastName": "string",
                "department": "string",
                "rollNumber": "string",
                "cgpa": "number",
                "contactNumber": "string",
                "programYear": "string",
                "email": "string",
                "password": "string"
            }
            ```
        - **Response:**
            - **201 Created:** User created successfully.
            - **400 Bad Request:** Error message.
      
        ## Get User
- **Endpoint:** `GET /admin/all`
- **Description:** Retrieve all User 


### Get All Users
- **Endpoint:** `GET /api/users`
- **Description:** Retrieve all users.
- **Response:**
    - **200 OK:** List of users.
    - **400 Bad Request:** Error message.
        ### Get User by ID
        - **Endpoint:** `GET /user/:id`
        - **Description:** Retrieve a user by their ID.
        - **Response:**
            - **200 OK:** User object.
            - **404 Not Found:** User not found.
            - **400 Bad Request:** Error message.

        ### Update User
        - **Endpoint:** `PUT /user/:id`
        - **Description:** Update an existing user by their ID.
        - **Request Body:** (Any fields to update)
            ```json
            {
                "name": "string",
                "lastName": "string",
                "department": "string",
                "rollNumber": "string",
                "cgpa": "number",
                "contactNumber": "string",
                "programYear": "string",
                "email": "string",
                "password": "string"
            }
            ```
        - **Response:**
            - **200 OK:** Updated user object.
            - **404 Not Found:** User not found.
            - **400 Bad Request:** Error message.

        ### Delete User
        - **Endpoint:** `DELETE /user/:id`
        - **Description:** Delete a user by their ID.
        - **Response:**
            - **200 OK:** User deleted successfully.
            - **404 Not Found:** User not found.
            - **400 Bad Request:** Error message.
            ## Event Controller Endpoints

            ### Create Event
            - **Endpoint:** `POST /api/events`
            - **Description:** Create a new event.
            - **Request Body:**
                ```json
                {
                    "image": "string",
                    "title": "string",
                    "description": "string",
                    "address": "string",
                    "date": "string"
                }
                ```
            - **Response:**
                - **201 Created:** Event created successfully.
                - **400 Bad Request:** Error message.

            ### Get All Events
            - **Endpoint:** `GET /api/events`
            - **Description:** Retrieve all events.
            - **Response:**
                - **200 OK:** List of events.
                - **400 Bad Request:** Error message.

            ### Get Event by ID
            - **Endpoint:** `GET /api/events/:id`
            - **Description:** Retrieve an event by its ID.
            - **Response:**
                - **200 OK:** Event object.
                - **404 Not Found:** Event not found.
                - **400 Bad Request:** Error message.

            ### Update Event
            - **Endpoint:** `PUT /api/events/:id`
            - **Description:** Update an existing event by its ID.
            - **Request Body:** (Any fields to update)
                ```json
                {
                    "image": "string",
                    "title": "string",
                    "description": "string",
                    "address": "string",
                    "date": "string"
                }
                ```
            - **Response:**
                - **200 OK:** Updated event object.
                - **404 Not Found:** Event not found.
                - **400 Bad Request:** Error message.

            ### Delete Event
            - **Endpoint:** `DELETE /api/events/:id`
            - **Description:** Delete an event by its ID.
            - **Response:**
                - **200 OK:** Event deleted successfully.
                - **404 Not Found:** Event not found.
                - **400 Bad Request:** Error message.
                ## Announcement Controller Endpoints

                ### Create Announcement
                - **Endpoint:** `POST /api/announcements`
                - **Description:** Create a new announcement.
                - **Request Body:**
                    ```json
                    {
                        "title": "string",
                        "description": "string"
                    }
                    ```
                - **Response:**
                    - **201 Created:** Announcement created successfully.
                    - **400 Bad Request:** Error message.

                ### Get All Announcements
                - **Endpoint:** `GET /api/announcements`
                - **Description:** Retrieve all announcements.
                - **Response:**
                    - **200 OK:** List of announcements.
                    - **400 Bad Request:** Error message.

                ### Get Announcement by ID
                - **Endpoint:** `GET /api/announcements/:id`
                - **Description:** Retrieve an announcement by its ID.
                - **Response:**
                    - **200 OK:** Announcement object.
                    - **404 Not Found:** Announcement not found.
                    - **400 Bad Request:** Error message.

                ### Update Announcement
                - **Endpoint:** `PUT /api/announcements/:id`
                - **Description:** Update an existing announcement by its ID.
                - **Request Body:** (Any fields to update)
                    ```json
                    {
                        "title": "string",
                        "description": "string"
                    }
                    ```
                - **Response:**
                    - **200 OK:** Updated announcement object.
                    - **404 Not Found:** Announcement not found.
                    - **400 Bad Request:** Error message.

                ### Delete Announcement
                - **Endpoint:** `DELETE /api/announcements/:id`
                - **Description:** Delete an announcement by its ID.
                - **Response:**
                    - **200 OK:** Announcement deleted successfully.
                    - **404 Not Found:** Announcement not found.
                    - **400 Bad Request:** Error message.
                    ## Report Controller Endpoints

                    ### Create Report
                    - **Endpoint:** `POST /api/reports/create`
                    - **Description:** Create a new report.
                    - **Request Body:**
                        ```json
                        {
                            "userId": "string",
                            "message": "string"
                        }
                        ```
                    - **Response:**
                        - **201 Created:** Report created successfully.
                        - **400 Bad Request:** Error message.

                    ### Get All Reports
                    - **Endpoint:** `GET /api/reports/all`
                    - **Description:** Retrieve all reports.
                    - **Response:**
                        - **200 OK:** List of reports.
                        - **400 Bad Request:** Error message.

                    ### Suspend User
                    - **Endpoint:** `PUT /api/reports/suspend/:reportId`
                    - **Description:** Suspend a user based on a report.
                    - **Response:**
                        - **200 OK:** User suspended successfully.
                        - **404 Not Found:** Report or user not found.
                        - **400 Bad Request:** Error message.

                    ### Unsuspend User
                    - **Endpoint:** `PUT /api/reports/unsuspend/:reportId`
                    - **Description:** Unsuspend a user based on a report.
                    - **Response:**
                        - **200 OK:** User unsuspended successfully.
                        - **404 Not Found:** Report or user not found.
                        - **400 Bad Request:** Error message.