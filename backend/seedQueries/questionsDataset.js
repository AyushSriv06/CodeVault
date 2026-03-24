const toArrayLiteral = (arr) => `[${arr.join(",")}]`;
const toCodeArrayLiteral = (arr) => `{${arr.join(",")}}`;
const toEscaped = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const asBoolInt = (value) => (value ? 1 : 0);

const buildExamples = (questionType, tests) => {
        return tests.slice(0, 2).map((test, index) => ({
                input: formatInput(questionType, test),
                output: String(test.expected),
                explanation:
                        index === 0
                                ? "This case demonstrates the primary behavior."
                                : "This case covers a common edge scenario.",
        }));
};

const buildTestCases = (questionType, tests) => {
        return tests.map((test, index) => ({
                input: formatInput(questionType, test),
                output: String(test.expected),
                isHidden: index >= 2,
        }));
};

function formatInput(type, test) {
        switch (type) {
                case "intArrayToBool":
                case "intArrayToInt":
                        return `nums = ${toArrayLiteral(test.input)}`;
                case "intToInt":
                        return `n = ${test.input}`;
                case "intArrayTargetToInt":
                        return `nums = ${toArrayLiteral(test.input)}, target = ${test.target}`;
                case "stringToBool":
                case "stringToInt":
                        return `s = \"${test.input}\"`;
                case "twoStringsToBool":
                        return `s = \"${test.s}\", t = \"${test.t}\"`;
                default:
                        return "";
        }
}

function buildBoilerplate(type, methodName) {
        const map = {
                intArrayToBool: {
                        c: `#include <stdio.h>\n\nint ${methodName}(int* nums, int numsSize) {\n    // Return 1 for true, 0 for false\n    return 0;\n}`,
                        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool ${methodName}(vector<int>& nums) {\n        // Write your code here\n        return false;\n    }\n};`,
                        java: `class Solution {\n    public boolean ${methodName}(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, nums):\n        # Write your code here\n        pass`,
                },
                intArrayToInt: {
                        c: `#include <stdio.h>\n\nint ${methodName}(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}`,
                        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${methodName}(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};`,
                        java: `class Solution {\n    public int ${methodName}(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, nums):\n        # Write your code here\n        pass`,
                },
                intToInt: {
                        c: `#include <stdio.h>\n\nint ${methodName}(int n) {\n    // Write your code here\n    return 0;\n}`,
                        cpp: `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${methodName}(int n) {\n        // Write your code here\n        return 0;\n    }\n};`,
                        java: `class Solution {\n    public int ${methodName}(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, n):\n        # Write your code here\n        pass`,
                },
                intArrayTargetToInt: {
                        c: `#include <stdio.h>\n\nint ${methodName}(int* nums, int numsSize, int target) {\n    // Write your code here\n    return -1;\n}`,
                        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${methodName}(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};`,
                        java: `class Solution {\n    public int ${methodName}(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, nums, target):\n        # Write your code here\n        pass`,
                },
                stringToBool: {
                        c: `#include <stdio.h>\n#include <string.h>\n\nint ${methodName}(char* s) {\n    // Return 1 for true, 0 for false\n    return 0;\n}`,
                        cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool ${methodName}(string s) {\n        // Write your code here\n        return false;\n    }\n};`,
                        java: `class Solution {\n    public boolean ${methodName}(String s) {\n        // Write your code here\n        return false;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, s):\n        # Write your code here\n        pass`,
                },
                stringToInt: {
                        c: `#include <stdio.h>\n#include <string.h>\n\nint ${methodName}(char* s) {\n    // Write your code here\n    return 0;\n}`,
                        cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${methodName}(string s) {\n        // Write your code here\n        return 0;\n    }\n};`,
                        java: `class Solution {\n    public int ${methodName}(String s) {\n        // Write your code here\n        return 0;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, s):\n        # Write your code here\n        pass`,
                },
                twoStringsToBool: {
                        c: `#include <stdio.h>\n#include <string.h>\n\nint ${methodName}(char* s, char* t) {\n    // Return 1 for true, 0 for false\n    return 0;\n}`,
                        cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool ${methodName}(string s, string t) {\n        // Write your code here\n        return false;\n    }\n};`,
                        java: `class Solution {\n    public boolean ${methodName}(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}`,
                        python: `class Solution:\n    def ${methodName}(self, s, t):\n        # Write your code here\n        pass`,
                },
        };

        return map[type];
}

function buildTemplateCode(type, methodName, tests) {
        return {
                c: buildCTemplate(type, methodName, tests),
                cpp: buildCppTemplate(type, methodName, tests),
                java: buildJavaTemplate(type, methodName, tests),
                python: buildPythonTemplate(type, methodName, tests),
        };
}

function buildCTemplate(type, methodName, tests) {
        const lines = [
                "int main() {",
                `    int total = ${tests.length};`,
                "    int passed = 0;",
                '    printf("__JUDGE_START__\\n");',
                '    printf("TOTAL|%d\\n", total);',
        ];

        tests.forEach((test, idx) => {
                const n = idx + 1;
                const expected = isBoolType(type) ? asBoolInt(test.expected) : test.expected;
                const inputLabel = toEscaped(formatInput(type, test));

                if (type === "intArrayToBool" || type === "intArrayToInt") {
                        lines.push("    {");
                        lines.push(`        int nums[] = ${toCodeArrayLiteral(test.input)};`);
                        lines.push(`        int got = ${methodName}(nums, ${test.input.length});`);
                        if (isBoolType(type)) {
                                lines.push("        got = got ? 1 : 0;");
                        }
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "intToInt") {
                        lines.push("    {");
                        lines.push(`        int got = ${methodName}(${test.input});`);
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "intArrayTargetToInt") {
                        lines.push("    {");
                        lines.push(`        int nums[] = ${toCodeArrayLiteral(test.input)};`);
                        lines.push(`        int got = ${methodName}(nums, ${test.input.length}, ${test.target});`);
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "stringToBool" || type === "stringToInt") {
                        lines.push("    {");
                        lines.push(`        char s[] = \"${toEscaped(test.input)}\";`);
                        lines.push(`        int got = ${methodName}(s);`);
                        if (isBoolType(type)) {
                                lines.push("        got = got ? 1 : 0;");
                        }
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "twoStringsToBool") {
                        lines.push("    {");
                        lines.push(`        char s[] = \"${toEscaped(test.s)}\";`);
                        lines.push(`        char t[] = \"${toEscaped(test.t)}\";`);
                        lines.push(`        int got = ${methodName}(s, t);`);
                        lines.push("        got = got ? 1 : 0;");
                        lines.push(`        int expected = ${expected};`);
                }

                lines.push("        if (got == expected) {");
                lines.push("            passed++;\n            printf(\"CASE|" + n + "|PASS|" + inputLabel + "|%d|%d\\n\", expected, got);");
                lines.push("        } else {");
                lines.push("            printf(\"CASE|" + n + "|FAIL|" + inputLabel + "|%d|%d\\n\", expected, got);");
                lines.push("        }");
                lines.push("    }");
        });

        lines.push('    printf("PASSED|%d\\n", passed);');
        lines.push('    printf("__JUDGE_END__\\n");');
        lines.push("    return 0;");
        lines.push("}");

        return lines.join("\n");
}

function buildCppTemplate(type, methodName, tests) {
        const lines = [
                "int main() {",
                "    Solution sol;",
                `    int total = ${tests.length};`,
                "    int passed = 0;",
                '    cout << "__JUDGE_START__" << endl;',
                '    cout << "TOTAL|" << total << endl;',
        ];

        tests.forEach((test, idx) => {
                const n = idx + 1;
                const expected = isBoolType(type) ? asBoolInt(test.expected) : test.expected;
                const inputLabel = toEscaped(formatInput(type, test));

                if (type === "intArrayToBool" || type === "intArrayToInt") {
                        lines.push("    {");
                        lines.push(`        vector<int> nums = ${toCodeArrayLiteral(test.input)};`);
                        lines.push(`        int got = sol.${methodName}(nums);`);
                        if (isBoolType(type)) {
                                lines.push("        got = got ? 1 : 0;");
                        }
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "intToInt") {
                        lines.push("    {");
                        lines.push(`        int got = sol.${methodName}(${test.input});`);
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "intArrayTargetToInt") {
                        lines.push("    {");
                        lines.push(`        vector<int> nums = ${toCodeArrayLiteral(test.input)};`);
                        lines.push(`        int got = sol.${methodName}(nums, ${test.target});`);
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "stringToBool" || type === "stringToInt") {
                        lines.push("    {");
                        lines.push(`        int got = sol.${methodName}(\"${toEscaped(test.input)}\");`);
                        if (isBoolType(type)) {
                                lines.push("        got = got ? 1 : 0;");
                        }
                        lines.push(`        int expected = ${expected};`);
                } else if (type === "twoStringsToBool") {
                        lines.push("    {");
                        lines.push(`        int got = sol.${methodName}(\"${toEscaped(test.s)}\", \"${toEscaped(test.t)}\");`);
                        lines.push("        got = got ? 1 : 0;");
                        lines.push(`        int expected = ${expected};`);
                }

                lines.push("        if (got == expected) {");
                lines.push(`            passed++; cout << \"CASE|${n}|PASS|${inputLabel}|\" << expected << \"|\" << got << endl;`);
                lines.push("        } else {");
                lines.push(`            cout << \"CASE|${n}|FAIL|${inputLabel}|\" << expected << \"|\" << got << endl;`);
                lines.push("        }");
                lines.push("    }");
        });

        lines.push('    cout << "PASSED|" << passed << endl;');
        lines.push('    cout << "__JUDGE_END__" << endl;');
        lines.push("    return 0;");
        lines.push("}");
        return lines.join("\n");
}

function buildJavaTemplate(type, methodName, tests) {
        const lines = [
                "public class Main {",
                "    public static void main(String[] args) {",
                "        Solution sol = new Solution();",
                `        int total = ${tests.length};`,
                "        int passed = 0;",
                '        System.out.println("__JUDGE_START__");',
                '        System.out.println("TOTAL|" + total);',
        ];

        tests.forEach((test, idx) => {
                const n = idx + 1;
                const expected = isBoolType(type) ? asBoolInt(test.expected) : test.expected;
                const inputLabel = toEscaped(formatInput(type, test));

                if (type === "intArrayToBool" || type === "intArrayToInt") {
                        lines.push("        {");
                        lines.push(`            int[] nums = new int[]${toCodeArrayLiteral(test.input)};`);
                        lines.push(`            int got = sol.${methodName}(nums) ? 1 : 0;`);
                        if (!isBoolType(type)) {
                                lines[lines.length - 1] = `            int got = sol.${methodName}(nums);`;
                        }
                        lines.push(`            int expected = ${expected};`);
                } else if (type === "intToInt") {
                        lines.push("        {");
                        lines.push(`            int got = sol.${methodName}(${test.input});`);
                        lines.push(`            int expected = ${expected};`);
                } else if (type === "intArrayTargetToInt") {
                        lines.push("        {");
                        lines.push(`            int[] nums = new int[]${toCodeArrayLiteral(test.input)};`);
                        lines.push(`            int got = sol.${methodName}(nums, ${test.target});`);
                        lines.push(`            int expected = ${expected};`);
                } else if (type === "stringToBool" || type === "stringToInt") {
                        lines.push("        {");
                        if (isBoolType(type)) {
                                lines.push(`            int got = sol.${methodName}(\"${toEscaped(test.input)}\") ? 1 : 0;`);
                        } else {
                                lines.push(`            int got = sol.${methodName}(\"${toEscaped(test.input)}\");`);
                        }
                        lines.push(`            int expected = ${expected};`);
                } else if (type === "twoStringsToBool") {
                        lines.push("        {");
                        lines.push(`            int got = sol.${methodName}(\"${toEscaped(test.s)}\", \"${toEscaped(test.t)}\") ? 1 : 0;`);
                        lines.push(`            int expected = ${expected};`);
                }

                lines.push("            if (got == expected) {");
                lines.push(`                passed++; System.out.println(\"CASE|${n}|PASS|${inputLabel}|\" + expected + \"|\" + got);`);
                lines.push("            } else {");
                lines.push(`                System.out.println(\"CASE|${n}|FAIL|${inputLabel}|\" + expected + \"|\" + got);`);
                lines.push("            }");
                lines.push("        }");
        });

        lines.push('        System.out.println("PASSED|" + passed);');
        lines.push('        System.out.println("__JUDGE_END__");');
        lines.push("    }");
        lines.push("}");

        return lines.join("\n");
}

function buildPythonTemplate(type, methodName, tests) {
        const lines = [
                "if __name__ == '__main__':",
                "    sol = Solution()",
                `    total = ${tests.length}`,
                "    passed = 0",
                "    print('__JUDGE_START__')",
                "    print(f'TOTAL|{total}')",
        ];

        tests.forEach((test, idx) => {
                const n = idx + 1;
                const expected = isBoolType(type) ? asBoolInt(test.expected) : test.expected;
                const inputLabel = formatInput(type, test);

                if (type === "intArrayToBool" || type === "intArrayToInt") {
                        lines.push(`    got = sol.${methodName}(${JSON.stringify(test.input)})`);
                        if (isBoolType(type)) lines.push("    got = 1 if got else 0");
                } else if (type === "intToInt") {
                        lines.push(`    got = sol.${methodName}(${test.input})`);
                } else if (type === "intArrayTargetToInt") {
                        lines.push(`    got = sol.${methodName}(${JSON.stringify(test.input)}, ${test.target})`);
                } else if (type === "stringToBool" || type === "stringToInt") {
                        lines.push(`    got = sol.${methodName}(${JSON.stringify(test.input)})`);
                        if (isBoolType(type)) lines.push("    got = 1 if got else 0");
                } else if (type === "twoStringsToBool") {
                        lines.push(`    got = sol.${methodName}(${JSON.stringify(test.s)}, ${JSON.stringify(test.t)})`);
                        lines.push("    got = 1 if got else 0");
                }

                lines.push(`    expected = ${expected}`);
                lines.push("    if got == expected:");
                lines.push("        passed += 1");
                lines.push(`        print(f"CASE|${n}|PASS|${inputLabel}|{expected}|{got}")`);
                lines.push("    else:");
                lines.push(`        print(f"CASE|${n}|FAIL|${inputLabel}|{expected}|{got}")`);
        });

        lines.push("    print(f'PASSED|{passed}')");
        lines.push("    print('__JUDGE_END__')");

        return lines.join("\n");
}

function isBoolType(type) {
        return ["intArrayToBool", "stringToBool", "twoStringsToBool"].includes(type);
}

const questionSpecs = [
        {
                id: "1",
                title: "Contains Duplicate",
                diff: "easy",
                type: "intArrayToBool",
                methodName: "containsDuplicate",
                description:
                        "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
                constraints: [
                        "1 <= nums.length <= 10^5",
                        "-10^9 <= nums[i] <= 10^9",
                ],
                topics: ["Array", "Hash Table", "Sorting"],
                tests: [
                        { input: [1, 2, 3, 1], expected: 1 },
                        { input: [1, 2, 3, 4], expected: 0 },
                        { input: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2], expected: 1 },
                        { input: [0], expected: 0 },
                        { input: [-1, -1], expected: 1 },
                ],
                solution: {
                        c: `int containsDuplicate(int* nums, int numsSize) {\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] == nums[j]) return 1;\n        }\n    }\n    return 0;\n}`,
                        cpp: `class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int x : nums) {\n            if (seen.count(x)) return true;\n            seen.insert(x);\n        }\n        return false;\n    }\n};`,
                        java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        HashSet<Integer> seen = new HashSet<>();\n        for (int x : nums) {\n            if (seen.contains(x)) return true;\n            seen.add(x);\n        }\n        return false;\n    }\n}`,
                        python: `class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for x in nums:\n            if x in seen:\n                return True\n            seen.add(x)\n        return False`,
                },
        },
        {
                id: "2",
                title: "Best Time to Buy and Sell Stock",
                diff: "easy",
                type: "intArrayToInt",
                methodName: "maxProfit",
                description:
                        "You are given an array prices where prices[i] is the price of a given stock on the i-th day.\nReturn the maximum profit you can achieve from a single buy/sell transaction.\nIf no profit is possible, return 0.",
                constraints: [
                        "1 <= prices.length <= 10^5",
                        "0 <= prices[i] <= 10^4",
                ],
                topics: ["Array", "Dynamic Programming", "Greedy"],
                tests: [
                        { input: [7, 1, 5, 3, 6, 4], expected: 5 },
                        { input: [7, 6, 4, 3, 1], expected: 0 },
                        { input: [2, 4, 1], expected: 2 },
                        { input: [1, 2], expected: 1 },
                        { input: [3, 3, 5, 0, 0, 3, 1, 4], expected: 4 },
                ],
                solution: {
                        c: `int maxProfit(int* nums, int numsSize) {\n    if (numsSize == 0) return 0;\n    int minPrice = nums[0], ans = 0;\n    for (int i = 1; i < numsSize; i++) {\n        if (nums[i] < minPrice) minPrice = nums[i];\n        int profit = nums[i] - minPrice;\n        if (profit > ans) ans = profit;\n    }\n    return ans;\n}`,
                        cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& nums) {\n        int minPrice = nums[0], ans = 0;\n        for (int i = 1; i < (int)nums.size(); i++) {\n            minPrice = min(minPrice, nums[i]);\n            ans = max(ans, nums[i] - minPrice);\n        }\n        return ans;\n    }\n};`,
                        java: `class Solution {\n    public int maxProfit(int[] nums) {\n        int minPrice = nums[0], ans = 0;\n        for (int i = 1; i < nums.length; i++) {\n            minPrice = Math.min(minPrice, nums[i]);\n            ans = Math.max(ans, nums[i] - minPrice);\n        }\n        return ans;\n    }\n}`,
                        python: `class Solution:\n    def maxProfit(self, nums):\n        min_price = nums[0]\n        ans = 0\n        for x in nums[1:]:\n            min_price = min(min_price, x)\n            ans = max(ans, x - min_price)\n        return ans`,
                },
        },
        {
                id: "3",
                title: "Maximum Subarray",
                diff: "medium",
                type: "intArrayToInt",
                methodName: "maxSubArray",
                description:
                        "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",
                constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
                topics: ["Array", "Divide and Conquer", "Dynamic Programming"],
                tests: [
                        { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
                        { input: [1], expected: 1 },
                        { input: [5, 4, -1, 7, 8], expected: 23 },
                        { input: [-1, -2, -3], expected: -1 },
                        { input: [0, 0, 0], expected: 0 },
                ],
                solution: {
                        c: `int maxSubArray(int* nums, int numsSize) {\n    int best = nums[0], current = nums[0];\n    for (int i = 1; i < numsSize; i++) {\n        if (current < 0) current = nums[i];\n        else current += nums[i];\n        if (current > best) best = current;\n    }\n    return best;\n}`,
                        cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int best = nums[0], current = nums[0];\n        for (int i = 1; i < (int)nums.size(); i++) {\n            current = max(nums[i], current + nums[i]);\n            best = max(best, current);\n        }\n        return best;\n    }\n};`,
                        java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int best = nums[0], current = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            current = Math.max(nums[i], current + nums[i]);\n            best = Math.max(best, current);\n        }\n        return best;\n    }\n}`,
                        python: `class Solution:\n    def maxSubArray(self, nums):\n        best = current = nums[0]\n        for x in nums[1:]:\n            current = max(x, current + x)\n            best = max(best, current)\n        return best`,
                },
        },
        {
                id: "4",
                title: "Climbing Stairs",
                diff: "easy",
                type: "intToInt",
                methodName: "climbStairs",
                description:
                        "You are climbing a staircase. It takes n steps to reach the top.\nEach time you can either climb 1 or 2 steps. Return the number of distinct ways to climb to the top.",
                constraints: ["1 <= n <= 45"],
                topics: ["Math", "Dynamic Programming", "Memoization"],
                tests: [
                        { input: 2, expected: 2 },
                        { input: 3, expected: 3 },
                        { input: 5, expected: 8 },
                        { input: 1, expected: 1 },
                        { input: 10, expected: 89 },
                ],
                solution: {
                        c: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
                        cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n};`,
                        java: `class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}`,
                        python: `class Solution:\n    def climbStairs(self, n):\n        if n <= 2:\n            return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b`,
                },
        },
        {
                id: "5",
                title: "Binary Search",
                diff: "easy",
                type: "intArrayTargetToInt",
                methodName: "binarySearch",
                description:
                        "Given a sorted (ascending) integer array nums and a target value, return its index if found. Otherwise, return -1.",
                constraints: [
                        "1 <= nums.length <= 10^5",
                        "-10^4 < nums[i], target < 10^4",
                        "All values in nums are unique",
                ],
                topics: ["Array", "Binary Search"],
                tests: [
                        { input: [-1, 0, 3, 5, 9, 12], target: 9, expected: 4 },
                        { input: [-1, 0, 3, 5, 9, 12], target: 2, expected: -1 },
                        { input: [5], target: 5, expected: 0 },
                        { input: [2, 4, 6, 8], target: 8, expected: 3 },
                        { input: [1, 3], target: 1, expected: 0 },
                ],
                solution: {
                        c: `int binarySearch(int* nums, int numsSize, int target) {\n    int l = 0, r = numsSize - 1;\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (nums[m] == target) return m;\n        if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}`,
                        cpp: `class Solution {\npublic:\n    int binarySearch(vector<int>& nums, int target) {\n        int l = 0, r = (int)nums.size() - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n};`,
                        java: `class Solution {\n    public int binarySearch(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n}`,
                        python: `class Solution:\n    def binarySearch(self, nums, target):\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            m = l + (r - l) // 2\n            if nums[m] == target:\n                return m\n            if nums[m] < target:\n                l = m + 1\n            else:\n                r = m - 1\n        return -1`,
                },
        },
        {
                id: "6",
                title: "Search Insert Position",
                diff: "easy",
                type: "intArrayTargetToInt",
                methodName: "searchInsert",
                description:
                        "Given a sorted array of distinct integers and a target value, return the index if the target is found.\nIf not, return the index where it would be inserted in order.",
                constraints: [
                        "1 <= nums.length <= 10^4",
                        "-10^4 <= nums[i] <= 10^4",
                        "nums contains distinct values sorted in ascending order",
                ],
                topics: ["Array", "Binary Search"],
                tests: [
                        { input: [1, 3, 5, 6], target: 5, expected: 2 },
                        { input: [1, 3, 5, 6], target: 2, expected: 1 },
                        { input: [1, 3, 5, 6], target: 7, expected: 4 },
                        { input: [1], target: 0, expected: 0 },
                        { input: [1, 3], target: 2, expected: 1 },
                ],
                solution: {
                        c: `int searchInsert(int* nums, int numsSize, int target) {\n    int l = 0, r = numsSize - 1;\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (nums[m] == target) return m;\n        if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    return l;\n}`,
                        cpp: `class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        int l = 0, r = (int)nums.size() - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return l;\n    }\n};`,
                        java: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (nums[m] == target) return m;\n            if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return l;\n    }\n}`,
                        python: `class Solution:\n    def searchInsert(self, nums, target):\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            m = l + (r - l) // 2\n            if nums[m] == target:\n                return m\n            if nums[m] < target:\n                l = m + 1\n            else:\n                r = m - 1\n        return l`,
                },
        },
        {
                id: "7",
                title: "Valid Parentheses",
                diff: "easy",
                type: "stringToBool",
                methodName: "isValidParentheses",
                description:
                        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\nAn input string is valid if open brackets are closed by the same type and in the correct order.",
                constraints: ["1 <= s.length <= 10^4", "s consists only of bracket characters"],
                topics: ["String", "Stack"],
                tests: [
                        { input: "()", expected: 1 },
                        { input: "()[]{}", expected: 1 },
                        { input: "(]", expected: 0 },
                        { input: "([)]", expected: 0 },
                        { input: "{[]}", expected: 1 },
                ],
                solution: {
                        c: `int isValidParentheses(char* s) {\n    char stack[100005];\n    int top = -1;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        char c = s[i];\n        if (c == '(' || c == '[' || c == '{') {\n            stack[++top] = c;\n        } else {\n            if (top < 0) return 0;\n            char t = stack[top--];\n            if ((c == ')' && t != '(') ||\n                (c == ']' && t != '[') ||\n                (c == '}' && t != '{')) return 0;\n        }\n    }\n    return top == -1;\n}`,
                        cpp: `class Solution {\npublic:\n    bool isValidParentheses(string s) {\n        vector<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '[' || c == '{') st.push_back(c);\n            else {\n                if (st.empty()) return false;\n                char t = st.back();\n                st.pop_back();\n                if ((c == ')' && t != '(') ||\n                    (c == ']' && t != '[') ||\n                    (c == '}' && t != '{')) return false;\n            }\n        }\n        return st.empty();\n    }\n};`,
                        java: `class Solution {\n    public boolean isValidParentheses(String s) {\n        ArrayDeque<Character> st = new ArrayDeque<>();\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == '(' || c == '[' || c == '{') st.push(c);\n            else {\n                if (st.isEmpty()) return false;\n                char t = st.pop();\n                if ((c == ')' && t != '(') ||\n                    (c == ']' && t != '[') ||\n                    (c == '}' && t != '{')) return false;\n            }\n        }\n        return st.isEmpty();\n    }\n}`,
                        python: `class Solution:\n    def isValidParentheses(self, s):\n        st = []\n        pairs = {')': '(', ']': '[', '}': '{'}\n        for ch in s:\n            if ch in '([{':\n                st.append(ch)\n            else:\n                if not st or st[-1] != pairs[ch]:\n                    return False\n                st.pop()\n        return len(st) == 0`,
                },
        },
        {
                id: "8",
                title: "Longest Substring Without Repeating Characters",
                diff: "medium",
                type: "stringToInt",
                methodName: "lengthOfLongestSubstring",
                description:
                        "Given a string s, find the length of the longest substring without repeating characters.",
                constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
                topics: ["Hash Table", "String", "Sliding Window"],
                tests: [
                        { input: "abcabcbb", expected: 3 },
                        { input: "bbbbb", expected: 1 },
                        { input: "pwwkew", expected: 3 },
                        { input: "", expected: 0 },
                        { input: "dvdf", expected: 3 },
                ],
                solution: {
                        c: `int lengthOfLongestSubstring(char* s) {\n    int last[256];\n    for (int i = 0; i < 256; i++) last[i] = -1;\n    int left = 0, best = 0;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        unsigned char c = (unsigned char)s[i];\n        if (last[c] >= left) left = last[c] + 1;\n        last[c] = i;\n        int len = i - left + 1;\n        if (len > best) best = len;\n    }\n    return best;\n}`,
                        cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        vector<int> last(256, -1);\n        int left = 0, best = 0;\n        for (int i = 0; i < (int)s.size(); i++) {\n            unsigned char c = s[i];\n            if (last[c] >= left) left = last[c] + 1;\n            last[c] = i;\n            best = max(best, i - left + 1);\n        }\n        return best;\n    }\n};`,
                        java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int[] last = new int[256];\n        Arrays.fill(last, -1);\n        int left = 0, best = 0;\n        for (int i = 0; i < s.length(); i++) {\n            int c = s.charAt(i);\n            if (last[c] >= left) left = last[c] + 1;\n            last[c] = i;\n            best = Math.max(best, i - left + 1);\n        }\n        return best;\n    }\n}`,
                        python: `class Solution:\n    def lengthOfLongestSubstring(self, s):\n        last = {}\n        left = 0\n        best = 0\n        for i, ch in enumerate(s):\n            if ch in last and last[ch] >= left:\n                left = last[ch] + 1\n            last[ch] = i\n            best = max(best, i - left + 1)\n        return best`,
                },
        },
        {
                id: "9",
                title: "Valid Anagram",
                diff: "easy",
                type: "twoStringsToBool",
                methodName: "isAnagram",
                description:
                        "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
                constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
                topics: ["Hash Table", "String", "Sorting"],
                tests: [
                        { s: "anagram", t: "nagaram", expected: 1 },
                        { s: "rat", t: "car", expected: 0 },
                        { s: "aacc", t: "ccac", expected: 0 },
                        { s: "listen", t: "silent", expected: 1 },
                        { s: "x", t: "x", expected: 1 },
                ],
                solution: {
                        c: `int isAnagram(char* s, char* t) {\n    int n = strlen(s), m = strlen(t);\n    if (n != m) return 0;\n    int count[26] = {0};\n    for (int i = 0; i < n; i++) {\n        count[s[i] - 'a']++;\n        count[t[i] - 'a']--;\n    }\n    for (int i = 0; i < 26; i++) if (count[i] != 0) return 0;\n    return 1;\n}`,
                        cpp: `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.size() != t.size()) return false;\n        vector<int> count(26, 0);\n        for (int i = 0; i < (int)s.size(); i++) {\n            count[s[i] - 'a']++;\n            count[t[i] - 'a']--;\n        }\n        for (int x : count) if (x != 0) return false;\n        return true;\n    }\n};`,
                        java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - 'a']++;\n            count[t.charAt(i) - 'a']--;\n        }\n        for (int x : count) if (x != 0) return false;\n        return true;\n    }\n}`,
                        python: `class Solution:\n    def isAnagram(self, s, t):\n        if len(s) != len(t):\n            return False\n        count = [0] * 26\n        for i in range(len(s)):\n            count[ord(s[i]) - ord('a')] += 1\n            count[ord(t[i]) - ord('a')] -= 1\n        return all(x == 0 for x in count)`,
                },
        },
        {
                id: "10",
                title: "Length of Last Word",
                diff: "easy",
                type: "stringToInt",
                methodName: "lengthOfLastWord",
                description:
                        "Given a string s consisting of words and spaces, return the length of the last word in the string.",
                constraints: ["1 <= s.length <= 10^4", "s consists of only English letters and spaces", "There is at least one word in s"],
                topics: ["String"],
                tests: [
                        { input: "Hello World", expected: 5 },
                        { input: "   fly me   to   the moon  ", expected: 4 },
                        { input: "luffy is still joyboy", expected: 6 },
                        { input: "a", expected: 1 },
                        { input: "day", expected: 3 },
                ],
                solution: {
                        c: `int lengthOfLastWord(char* s) {\n    int i = strlen(s) - 1;\n    while (i >= 0 && s[i] == ' ') i--;\n    int len = 0;\n    while (i >= 0 && s[i] != ' ') {\n        len++;\n        i--;\n    }\n    return len;\n}`,
                        cpp: `class Solution {\npublic:\n    int lengthOfLastWord(string s) {\n        int i = (int)s.size() - 1;\n        while (i >= 0 && s[i] == ' ') i--;\n        int len = 0;\n        while (i >= 0 && s[i] != ' ') {\n            len++;\n            i--;\n        }\n        return len;\n    }\n};`,
                        java: `class Solution {\n    public int lengthOfLastWord(String s) {\n        int i = s.length() - 1;\n        while (i >= 0 && s.charAt(i) == ' ') i--;\n        int len = 0;\n        while (i >= 0 && s.charAt(i) != ' ') {\n            len++;\n            i--;\n        }\n        return len;\n    }\n}`,
                        python: `class Solution:\n    def lengthOfLastWord(self, s):\n        i = len(s) - 1\n        while i >= 0 and s[i] == ' ':\n            i -= 1\n        length = 0\n        while i >= 0 and s[i] != ' ':\n            length += 1\n            i -= 1\n        return length`,
                },
        },
];

const questions = questionSpecs.map((spec) => ({
        id: spec.id,
        title: spec.title,
        description: spec.description,
        diff: spec.diff,
        constraints: spec.constraints,
        topics: spec.topics,
        example_cases: buildExamples(spec.type, spec.tests),
        test_cases: buildTestCases(spec.type, spec.tests),
        solution: spec.solution,
        boilerplate: buildBoilerplate(spec.type, spec.methodName),
        templatecode: buildTemplateCode(spec.type, spec.methodName, spec.tests),
}));

module.exports = questions;
