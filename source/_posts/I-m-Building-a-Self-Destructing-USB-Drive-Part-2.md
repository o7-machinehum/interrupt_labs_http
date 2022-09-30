---
title: I'm Building a Self-Destructing USB Drive Part 2
date: 2022-09-19 00:00:00
tags:
---

I'm building an open-source USB drive with a hidden self-destruct feature. Say goodbye to your data if you don't lick your fingers before plugging it in. Its target customers are journalists in anti-privacy countries and security researchers. [Part One Here](https://interruptlabs.ca/2022/07/29/I-m-Building-a-Self-Destructing-USB-Drive/)

---
This post outlines the design process and challenges. I'll discuss my bench prototyping, the schematic, layout and mechanical sourcing.

A lot of the responses to the last post pointed out that the device doesn't *actually* self-destruct. In response to these comments, the device will now have two modes: just hiding the data and a full self-destruct (FSD).

## Enclosure
I found a shop overseas selling USB enclosures without the internals, which saves me from designing an enclosure from scratch. I've never designed an injection moulded enclosure before, and today won't be the day.

![](/img/usb_case.jpg)<figcaption>USB Drive Enclosures</figcaption>

Out of the four samples I received, I settled on the black one (far left in the picture above). Unfortunately, the vendor could not give me 3D CAD files, just DXF. If you don't know, DXF is a simple flat drawing; not ideal, but better than nothing.

![](/img/case.png)<figcaption>Drawing of Enclosure</figcaption>

I took these DXF drawings, imported them into FreeCAD, and then extruded them into some 3D models. This was a strange way to draw a model; the DXF lines were converted to undimensioned FreeCAD sketch objects and then extruded. I imported the PCB and ended up here:

![](/img/usb.png)<figcaption>Device Render</figcaption>

Hopefully, the final build will come out looking something like that.

## FSD: Full Self Destruct
My goal is to build a discrete device; if the cops snatch a journalist in a non-privacy country, they shouldn't think twice about a loose USB drive. When they plug it in, the device shouldn't explode, melt, release corrosive material or do anything else insane (even though that would probably make a more exciting blog post). It should quietly destroy itself beyond repair.

My solution for this is overloading the flash memory voltage rail. I'll have to say, this is the first time I've ever actually looked at the absolute maximum ratings of a component.
![](/img/max_ratings.png)

The part needs to be pushed over 4.6V in order to be completely disabled. I can use a simple voltage doubler off the 5V line to do this.
![](/img/distruct.png)

The operation of this circuit is pretty simple. When Distruct_PWM is low, Ca will charge to 4.3V, which is 5V minus the 0.7V drop over the diode. When I set Distruct_PWM high from the MCU, this puts the bottom of Ca at 5, giving a total potential of 9.3V. This flows into Cb and gets trapped for the next cycle. When you want to dump the energy into the flash IC, enable Q1 and say goodbye to those cute dog pics.

## Sensing Circuit
OK, so how will the device know if the user has licked their fingers or not, and hence whether or not to destroy the data? This can be done with a bioimpedance measurement, i.e., a measurement of the resistance of the user's skin. If the skin's resistance is low (500k or less), we can assume their fingers are wet. There's probably a fancy chip to measure bioimpedance, but since the chip shortage, I've been inclined to use generic components.
![](/img/cct.png)

I pinched this circuit from _The Art of Electronics_; it's a current supply. Let's discuss how it works. U1 is a voltage reference; as long as it gets enough current to operate, there will be 2.5V dropped over it. The cathode is connected to R2, while the anode is connected to the non-inverting input of the opamp. The output of the opamp will supply the current required to hold the two inputs at the same voltage. Therefore we can assume there is 2.5V dropped over R2 as well. The current through R2 is then

{% katex %}
I_{R2} = \frac{2.5}{R_2}
{% endkatex %}

Our electrodes are connected across J1, and the voltage at Vx and Vs is again determined by Ohm's law:

{% katex %}
V_x = I_{R2} \cdot R_L
{% endkatex %}

So we can use these two equations to solve for the load resistance, RL:

{% katex %}
R_L = V_{out} \cdot \frac{R_2}{2.5}
{% endkatex %}

This is what we'll use to calculate skin resistance.

### Microcontroller
I chose a simple attiny25 for the brains of the project. It's a step down from the 32bit ARM chips I typically use. It was refreshing to fit the entire application into 55 lines of code with only one required header.

I configured a PWM channel to test the code. I read and ADC pin and output the voltage as a duty cycle on the PWM pin. Using my multimeter on DC mode, I read back the voltage I was sampling.

``` C
#include <avr/io.h>

// PWM PA6
// ADC PA1
// LED PA2

const float R2 = 747e3;   // R2 in schematic
const float Rth = 0.4e6;  // If r > 1Mohm, finger not wet.

void init_pwm() {
   DDRA |= (1 << PA6);                    // PA6 as output
   OCR1A = 0x0000;
   TCCR1A |= (1 << COM1A1);               // set non-inverting mode
   TCCR1A |= (1 << WGM11) | (1 << WGM10); // set 10bit phase corrected PWM Mode
   TCCR1B |= (1 << CS11);                 // set prescaler to 8 and starts PWM
}

void set_pwm(float voltage) {
   OCR1A = ( voltage / 5 )* 0x400;
}

void init_adc() {
    ADMUX &= ~(1 << REFS0); // Use 5V as reference
    ADMUX &= ~(1 << REFS1);
    ADMUX |= (1 << MUX0);   // Use ADC1 (PA1)
    ADCSRB |= (1 << ADLAR); // Left adjusted (8bit) operation alright
    ADCSRA |= (1 << ADEN);  // Enable ADC
}

float read_adc() {
    float voltage;
    ADCSRA |= (1 << ADSC);
    while(ADCSRA & (1 << ADSC)) {};
    voltage = ADCH;
    voltage = voltage * 5 / 0xff;
    return voltage;
}

int main(void) {
    DDRA = 1 << PA2; // LED

    init_pwm();
    init_adc();

    while(1)
    {
        float v, r = 0;

        v = read_adc();
        set_pwm(v);
        r = v * (R2/2.5);

        (r > Rth) ? (PORTA &= ~(1 << PA2)) : (PORTA |= 1 << PA2);
    }
}
```

## The Build
When working for a client, I don't breadboard. It's too expensive and doesn't make sense with modern SMD components. My usual workflow is to go from simulation straight to schematic and board design. But for this project, I reached for the breadboard. I did this in order to derisk the bioimpedance circuit I discussed above. It felt like I was back in school again, nostalgic about DIP components and paper schematics.
![](/img/lick.gif)<figcaption>Let there be light!</figcaption>

The logic works fine. All of the learnings from this prototype were integrated into the final design.

The next and final post will be documenting the entire build, I'm hoping to then get a small crowdfunding campaign launched to build several of these devices for the community. Stay in touch and happy hacking!

