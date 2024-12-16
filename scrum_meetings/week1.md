

## 📅 Meeting Information

- **Date:** 25/11/2024
- **Time:** 18:10
- **Location:** In-person, in classroom during class time
- **Scrum Master:** Mihaela Buturuga
- **Attendees:**
    - Eric López
    - Hao Yang
    - Ahmet Patkovic

## 📝 Completed Work

### Hao Yang

### Hao Yang
- **Admin Dashboard:**
    - Created admin dashboard displaying admin and company tables
    - Worked on admin login and database schema for admins

### Mihaela Buturuga
- **Finance Details Tab:**
    - Connected to the database.
    - Refactored schema to handle financial categories (income and expenses).
    - Pending addition of CRUD operations.

## ⚠️ Challenges 
### Hao Yang
- **Admin Login Verification:**
    - **Problem:** Supabase logs in directly before verifying admin status.
    - **Proposed Solution 1:** Direct request to `auth.users` table. Run server-side and use credentials.
        - **Outcome:** Cannot read `auth.users` table.
    - **Proposed Solution 2:** Email verification in `companies` table. Save email in both tables to check `companies` table instead of `auth.users`.
        - **Outcome:** Pending implementation


### Mihaela Buturuga
- **JavaScript Data Objects:**
    - **Problem:** Issue managing objects and properties extracted from the database due to unfamiliarity with the language.
    - **Resolution:** Debugged and resolved for the time being.
- **Data Loading Issues:**
    - **Problem:** Data not loaded on initial screen rendering. Requires page refresh to display.
    - **Proposed Solution:** Load screen only after data retrieval.
        - **Outcome:** Pending implementation

## 🗓️ Work for This Week

### Team Assignments

### Hao Yang 

- Complete admin login and dashboard.
- Redesign offers and challenges pages to match project styles.
- Further tasks to be assigned after completion.

### Mihaela Buturuga 

- Finalize finance screens (overview and details).

### Eric López 

- Complete homepage with features from sprint planning.

### Ahmet Patkovic

- Design goals and marketplace screens with planned components.


## 🐞 Current Issues

### Technical Issues
- **iOS Interface:**
    - Status bar color and text visibility problems. Error message displayed.
    - Bottom navbar looks smaller than in Android version. Needs adjustment.

- **Authentication:**
    - Logout doesn't work. When clicked, an error occurs and the app crashes. Need to restart the app to log in again.
