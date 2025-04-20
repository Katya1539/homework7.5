Feature: Movie Booking - User can book tickets online

  Background:
    Given I am on the movie booking website

  @happy-path
  Scenario: User successfully books two available seats
    Given I select day 1 for the session
    And I select the "10:00" session
    When I choose seat row 5 seat 5 and seat row 5 seat 6
    And I click the "Забронировать" button
    Then I should see a success message with the booked seat details

  @happy-path
  Scenario: User successfully books a single available seat
    Given I select day 2 for the session
    And I select the "12:00" session
    When I choose seat row 3 seat 4
    And I click the "Забронировать" button
    Then I should see a success message with the booked seat details

  @sad-path
  Scenario: User attempts to book an already booked seat
    Given I select day 3 for the session
    And I select the "14:00" session
    When I attempt to choose seat row 1 seat 1
    Then the "Забронировать" button should remain disabled
    And I should see an error message indicating the seat is unavailable