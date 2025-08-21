// JavaScript Syntax Validator for index.html
const fs = require('fs');

function validateJavaScript() {
    try {
        console.log('🔍 Validating JavaScript syntax in index.html...');
        
        // Read the HTML file
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // Extract JavaScript content between <script> tags
        const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
        
        if (!scriptMatches) {
            console.log('❌ No JavaScript found in HTML file');
            return;
        }
        
        let hasErrors = false;
        
        scriptMatches.forEach((scriptTag, index) => {
            // Extract just the JavaScript code
            const jsCode = scriptTag.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
            
            // Skip external scripts
            if (scriptTag.includes('src=')) {
                console.log(`⏭️  Skipping external script ${index + 1}`);
                return;
            }
            
            try {
                // Try to parse the JavaScript
                new Function(jsCode);
                console.log(`✅ Script block ${index + 1}: Syntax OK`);
            } catch (error) {
                console.log(`❌ Script block ${index + 1}: Syntax Error`);
                console.log(`   Error: ${error.message}`);
                
                // Try to find the line number
                const lines = jsCode.split('\n');
                const errorLine = error.message.match(/line (\d+)/);
                if (errorLine) {
                    const lineNum = parseInt(errorLine[1]);
                    console.log(`   Line ${lineNum}: ${lines[lineNum - 1]?.trim()}`);
                }
                
                hasErrors = true;
            }
        });
        
        if (hasErrors) {
            console.log('\n❌ JavaScript validation failed!');
            process.exit(1);
        } else {
            console.log('\n✅ All JavaScript syntax is valid!');
        }
        
    } catch (error) {
        console.error('❌ Error reading file:', error.message);
        process.exit(1);
    }
}

validateJavaScript();
