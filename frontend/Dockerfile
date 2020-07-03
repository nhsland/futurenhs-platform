FROM node:12

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copying source files
COPY . .

# Building app
RUN yarn lint
RUN yarn test
RUN NEXT_PUBLIC_INSTRUMENTATION_KEY=22def0fe-38ea-4aee-a7a6-7b2ddb347709 yarn build

# Running the app
CMD [ "yarn", "start" ]
