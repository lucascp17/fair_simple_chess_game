package br.com.pinheiro.event;

import org.springframework.context.ApplicationEvent;

public class NewPlayerEvent extends ApplicationEvent {

    private int macthCode;

    private boolean color;

    public NewPlayerEvent(Object source, int macthCode, boolean color) {
        super(source);
        this.macthCode = macthCode;
        this.color = color;
    }

    public int getMacthCode() {
        return macthCode;
    }

    public void setMacthCode(int macthCode) {
        this.macthCode = macthCode;
    }

    public boolean getColor() {
        return color;
    }

    public void setColor(boolean color) {
        this.color = color;
    }

}
