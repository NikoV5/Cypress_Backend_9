describe("API-Cypress Practice01", () => {
    const baseUrl = "https://api.tech-global-training.com/students";
    let newStudentId;
  
    it("TASK-1: Retrieve all students and validate the response", () => {

        // 1.	Send a GET request to the endpoint to retrieve all students.
      cy.request({
        method: "GET",
        url: baseUrl,
      }).then((response) => {

        // 2.	Validate that the status code is 200.
        expect(response.status).to.eq(200);

        // 3.	Validate that there are at least 2 students in the response.
        expect(response.body).to.have.length.greaterThan(1);


        // 4.	Validate that each student object has a property called STUDENT_ID.
        response.body.forEach((student) => {
          expect(student).to.have.property("STUDENT_ID");

        });
      });
    });
  
    it("TASK-2: Create a new student and validate the response", () => {

        // Create new student
      const newStudent = {
        DOB: "2000-01-01",
        EMAIL: "student@example.com",
        FIRST_NAME: "John",
        LAST_NAME: "Doe",
        INSTRUCTOR_ID: 1,
      };

      // 1.	Send a POST request to the endpoint to create a new student with the provided details.
      cy.request({
        method: "POST",
        url: baseUrl,
        body: newStudent,
      }).then((response) => {

        // 2.	Validate that the status code is 201.
        expect(response.status).to.eq(201);

        // 3.	Validate that the STUDENT_ID is greater than 2.
        const student = response.body;
        newStudentId = student.STUDENT_ID; 

        expect(student.STUDENT_ID).to.be.greaterThan(2);

        // 4.	Validate that the DOB matches the provided DOB.
        expect(student.DOB).to.eq(newStudent.DOB);

        // 5.	Validate that the EMAIL matches the provided EMAIL.
        expect(student.EMAIL).to.eq(newStudent.EMAIL);

        // 6.	Validate that the FIRST_NAME matches the provided FIRST_NAME.
        expect(student.FIRST_NAME).to.eq(newStudent.FIRST_NAME);

        // 7.	Validate that the LAST_NAME matches the provided LAST_NAME.
        expect(student.LAST_NAME).to.eq(newStudent.LAST_NAME);

        // 8.	Validate that the INSTRUCTOR_ID matches the provided INSTRUCTOR_ID.
        expect(student.INSTRUCTOR_ID).to.eq(newStudent.INSTRUCTOR_ID);

      });
    });
  
    it("TASK-3: Retrieve the newly created student and validate the response", () => {
        // 1.	Send a GET request to the endpoint to retrieve the newly created student using STUDENT_ID.
      cy.request({
        method: "GET",
        url: `${baseUrl}/${newStudentId}`,
      }).then((response) => {

        // 2.	Validate that the status code is 200.
        expect(response.status).to.eq(200);

        // 3.	Validate that the STUDENT_ID matches the provided STUDENT_ID.
        const student = response.body;

        expect(student.STUDENT_ID).to.eq(newStudentId);

        // 4.	Validate that the DOB matches the provided DOB.
        expect(student.DOB).to.contain("2000-01-01");

        // 5.	Validate that the EMAIL matches the provided EMAIL.
        expect(student.EMAIL).to.eq("student@example.com");

        // 6.	Validate that the FIRST_NAME matches the provided FIRST_NAME.
        expect(student.FIRST_NAME).to.eq("John");

        // 7.	Validate that the LAST_NAME matches the provided LAST_NAME.
        expect(student.LAST_NAME).to.eq("Doe");

        // 8.	Validate that the INSTRUCTOR_ID matches the provided INSTRUCTOR_ID.
        expect(student.INSTRUCTOR_ID).to.eq(1);

      });
    });
  
    it("TASK-4: Update the newly created student with a different instructor and validate the response", () => {
      
      const updatedInstructorId = 4;
        // 1.	Send a PUT request to the endpoint to update the student's INSTRUCTOR_ID.
      cy.request({
        method: "PATCH",
        url: `${baseUrl}/${newStudentId}`,
        body: { INSTRUCTOR_ID: updatedInstructorId },
      }).then((response) => {

        // 2.	Validate that the status code is 200.
        expect(response.status).to.eq(200);

        // 3.	Validate that the response message is 'Successfully updated {FIRST_NAME}'.
        expect(response.body.message).to.eq("Student's instructor id updated to '4'");

      });
    });
  
    it("TASK-5: Delete the newly created student and validate the response", () => {

        // 1.	Send a DELETE request to the endpoint to delete the student using STUDENT_ID.
      cy.request({
        method: "DELETE",
        url: `${baseUrl}/${newStudentId}`,
      }).then((response) => {

        // 2.	Validate that the status code is 204.
        expect(response.status).to.eq(200);

        // 3.	Validate that the response message is 'Successfully deleted user with Id: {STUDENT_ID}'.
        expect(response.body.message).to.eq("Successfully deleted user with ID: {STUDENT_ID}");


      });
    });
  });