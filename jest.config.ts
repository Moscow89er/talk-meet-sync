export default {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    testMatch: ["**/src/utils/tests/**/*.[tj]s?(x)"],
};