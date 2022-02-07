FROM fusuf/whatsasena:latest

RUN git clone https://github.com/I-AM-MUHAMMED/New /root/WhatsAsenaDuplicated
WORKDIR /root/WhatsAsenaDuplicated/
ENV TZ=Asia/Kolkata
RUN npm install supervisor -g
RUN yarn install --no-audit
RUN git clone https://github.com/I-AM-MUHAMMED/UPLOADS

CMD ["node", "bot.js"]
