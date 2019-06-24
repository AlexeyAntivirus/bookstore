package com.horizonbit.bookstore.server.data.exchange;


public class MakeOrderResultDto {
    private MakeOrderResultDetails details;

    public MakeOrderResultDto(MakeOrderResultDetails details) {
        this.details = details;
    }

    public MakeOrderResultDetails getDetails() {
        return details;
    }

    public void setDetails(MakeOrderResultDetails details) {
        this.details = details;
    }
}
