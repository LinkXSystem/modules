first_answer('and(job(person, list("computer", "programmer")), address(person, where))');

// expected: "and(job(list('Fect', 'Cy', 'D'), list('computer', 'programmer')), address(list('Fect', 'Cy', 'D'), list('Cambridge', 'Ames Street', 3)))"
