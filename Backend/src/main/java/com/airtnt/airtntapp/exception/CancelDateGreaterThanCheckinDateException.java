package com.airtnt.airtntapp.exception;

public class CancelDateGreaterThanCheckinDateException extends Exception {
    public CancelDateGreaterThanCheckinDateException(String message) {
        super(message);
    }
}
