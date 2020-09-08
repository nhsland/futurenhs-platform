FROM node:14

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copying source files
COPY . .

# Building app
RUN yarn test
RUN ORIGIN=__FNHS_ORIGIN__ NEXT_PUBLIC_INSTRUMENTATION_KEY=__FNHS_INSTRUMENTATION_KEY__ yarn build

# Running the app
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
CMD [ "yarn", "start" ]
