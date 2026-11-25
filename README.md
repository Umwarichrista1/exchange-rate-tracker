# Exchange Rate Tracker

A web app that shows live currency exchange rates. It helps students, travellers and small business owners check rates and convert money.

## Features

- Live rates for 160+ currencies
- Search by currency code (for example RWF)
- Filter by region (Africa, Major)
- Sort by code or by rate (high to low, low to high)
- Converter between any two currencies
- Error message if the API is down or the internet is off

## API used

[ExchangeRate-API](https://www.exchangerate-api.com) (open endpoint, no key needed).
Docs: https://www.exchangerate-api.com/docs/free

Thank you to the ExchangeRate-API team for the data.

## Run locally

1. Clone the repo:
   git clone https://github.com/Umwarichrista1/exchange-rate-tracker.git
2. Open the folder `exchange-rate-tracker`.
3. Double-click `index.html` to open it in your browser.

No install and no API key are needed.

## Deployment

Servers: Web01 `13.40.9.218`, Web02 `16.60.164.228`, Lb01 `3.8.131.233` (all Ubuntu).

### Web01 and Web02

Run on each server (log in with `ssh ubuntu@IP`):

    sudo apt-get update
    sudo apt-get install -y nginx git
    cd ~
    git clone https://github.com/Umwarichrista1/exchange-rate-tracker.git
    sudo cp exchange-rate-tracker/index.html exchange-rate-tracker/style.css exchange-rate-tracker/app.js /var/www/html/
    sudo nginx -t
    sudo systemctl restart nginx

Nginx serves the files from `/var/www/html`. Each server sends an `X-Served-By` header with its name.

### Load balancer (Lb01)

    sudo apt-get update
    sudo apt-get install -y haproxy

Then put the config from `deploy/haproxy.cfg` in `/etc/haproxy/haproxy.cfg` and run:

    sudo haproxy -c -f /etc/haproxy/haproxy.cfg
    sudo systemctl restart haproxy

- `balance roundrobin` sends each request to the next server in turn.
- `check` tests each server, so a dead server gets no traffic.

### Test

    for i in 1 2 3 4 5 6; do curl -sI http://3.8.131.233 | grep -i x-served-by; done

The answers switch between `7422-web-01` and `7422-web-02`.
To test failover, run `sudo systemctl stop nginx` on Web01. The site keeps working from Web02.

## Links

- Demo video: ADD_LINK_HERE
- Live site (load balancer): http://3.8.131.233
- Web01: http://13.40.9.218
- Web02: http://16.60.164.228

Note: open the site with http://(not https://).

## Credentials

No API key and no login are needed.


- **Page stuck on "Loading":** a missing `id` in the HTML (and a capital letter typo in a variable name) stopped the JavaScript. I found it with the browser Console (F12).
- **Testing the error message:** the browser used a cached answer. I turned on "Disable cache" and set the Network tab to Offline.
- **HTTPS warning on the IP:** the load balancer also has an HTTPS certificate for a domain, so `https://IP` shows a warning. I use `http://` for the IP link.
- **Proving the load balancer works:** I used the `X-Served-By` header and `curl` to see the servers take turns.
Author: Christa (GitHub: Umwarichrista1)