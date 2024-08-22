# Vero Optimizer CLI tool

The following is a NodeJS based CLI tool that for sole owners of "Osakeyhtiö" (aka Oy) companies in Finland.
It helps you to optimize your salary and dividents to minimize your tax burden.

# How it works

Unfortunately calculating the income tax in Finland is a complicated matter and there are no
libraries or APIs available that would do this for you.
There's [a website with the tax calculator](https://avoinomavero.vero.fi/?Language=ENG&Link=IITTaxRateCalc)
but it is a terrible wizard where the data between each stage is stored in the server session
and simply recreating the requests from the code is impractical.

This is why the tool uses "puppeteer" to automate actually spawn a bunch of browser instances
in the background to fill in the form and calculate the income tax for a range of the potential salaries
that you may choose to pay yourself and finds the best option.

# CLI Usage

TODO

# TODO

* print out check points. Once it asks you a lot of questions,
  it might be easier to just print out the full command line that
  you could write next time instead
* Display some jokes about taxes while waiting for tax calculation
* Give example benefits. Then you can do the special calculation for a car value or look up the specific mobile phone offers
* finish the remaining inputs
* make it possible to run this for the remainder of the year, rather than the whole year
* visualizations in html
* model how the dividents add up over time
* add validation to make sure you don't specify that you pay yourself more
  than the company makes