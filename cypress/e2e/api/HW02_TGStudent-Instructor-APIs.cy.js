/// <reference types='cypress'/>

describe('TechGlobal Student-Instructor APIs', () => {
    
    let newStudentId

    it('Task-1: Retrieve all instructors and validate the response', () => {
        // 1. Send a GET request to the 'Get all instructors' endpoint
        cy.request({
            method: "GET",
            url: 'https://api.tech-global-training.com/instructors',
        }).then((response) => {
            // 2. Validate that the status code is 200
            expect(response.status).to.eq(200);

            // 3. Validate that the response contains 4 instructors
            expect(response.body).to.have.length.greaterThan(3);

            // 4.1 Validate the presence of the INSTRUCTOR_ID property
            response.body.forEach((instructor) => {
                expect(instructor).to.have.property("INSTRUCTOR_ID");
                // 4.2 Validate the presence of the FULLNAME property
                expect(instructor).to.have.property("FULLNAME");
                // 4.3 Validate the presence of the STUDENTS property and that it is an array
                expect(instructor.STUDENTS).to.be.an('array')
            })
            // 5 Validate that the INSTRUCTOR_IDs are 1, 2, 3, and 4 respectively
            const expectedIds = [1, 2, 3, 4];
            response.body.forEach((instructor, index) => {
                expect(instructor.INSTRUCTOR_ID).to.eq(expectedIds[index]);
            })
        }) 
    })
    it('TASK-2: Retrieve a single instructor and validate the response', () => {

        // 1.	Send a GET request to the 'Get a single instructor' endpoint with a specific INSTRUCTOR_ID.
        const instructorId = 1;

        cy.request({
            method: 'GET',
            url: `https://api.tech-global-training.com/instructors/${instructorId}`,
        }).then((response) => {
            // 2.	Validate the status code is 200.
            expect(response.status).to.eq(200);
            // 3.	Validate that the INSTRUCTOR_ID in the response matches the provided INSTRUCTOR_ID.
            expect(response.body.INSTRUCTOR_ID).to.eq(instructorId);
            // 4.	Validate the response has the FULLNAME property.
            expect(response.body).to.have.property('FULLNAME');
            // 5.	Validate the STUDENTS property is present and is an array.
            expect(response.body).to.have.property('STUDENTS');
            expect(response.body.STUDENTS).to.be.an('array')
        })
    })
    it('TASK-3: Create a new student and validate its association with the instructor', () => {
        const instructorId = 3;

        const newStudent = {
            FIRST_NAME: 'John',
            LAST_NAME: 'Apple',
            DOB: '2001-05-10',
            EMAIL: 'JohnApple@Gmail.com',
            INSTRUCTOR_ID: 4,
        };

        // 1.	Send a POST request to create a new student, providing an INSTRUCTOR_ID.
        cy.request({
            method: 'POST',
            url: 'https://api.tech-global-training.com/students',
            body: newStudent,
            failOnStatusCode: false,
        }).then((response) => {

            // 2.	Validate the status code is 201.
            expect(response.status).to.eq(201);
            newStudentId = response.body.STUDENT_ID;

            // 3.	Send a GET request to the 'Get a single instructor' endpoint using the same INSTRUCTOR_ID.
            cy.request({
                method: 'GET',
                url: `https://api.tech-global-training.com/instructors/${instructorId}`,
            }).then((response) => {

                // 4.	Validate the status code is 200.
                expect(response.status).to.eq(200);

                // 5.	Validate the newly created student is listed in the STUDENTS array of the instructor.
                const hasStudent = response.body.STUDENTS.some(student => student.STUDENT_ID === newStudentId);
                expect(hasStudent).to.be.true;

                // 6.	Send a DELETE request to remove the newly created student.
                cy.request({
                        method: 'DELETE',
                        url: `https://api.tech-global-training.com/students/${newStudentId}`,
                      }).then((response) => {

                        // 7.	Validate the status code is 204.
                        expect(response.status).to.eq(204);
                    })
                })
            })
        });
    })
