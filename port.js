const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const menu = `
 ------------------------------
    Procesos puertos TCP/UDP
 ------------------------------
 [1] Listar puertos
 [2] Matar proceso
 [3] Salir
 Seleccione una opcion: `;

const menuOp = () => {
    console.clear();

    rl.question(menu, (answer) => {
        switch (answer) {
            case '1':
                listPorts();
                menuOp();
                break;
            case '2':
                rl.question(' Ingrese nro de puerto: ', (puerto) => {
                    pidPuerto(puerto);
                    menuOp();
                    // rl.close();
                });
                break;
            case '3':
                console.log(' Adios...');
                rl.close();
                break;
            default:
                console.log(' Por favor, selecciona una opcion valida');
                menuOp();
                break;
        }
    });
}

menuOp();

function listPorts() {
    const { exec } = require('child_process');

    exec('netstat -ano', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el comando: ${error}`);
            return;
        }

        const lines = stdout.split('\n');
        const filterTCP = lines.filter(line => line.trim().startsWith('TCP'));
        // const filterUDP = lines.filter(line => line.trim().startsWith('UDP')); // Ejemplo con UDP
        const seenD = {};
        const seenP = {};

        console.log('\nDireccion local:');
        filterTCP.forEach(line => {
            const columns = line.split(/\s+/);
            if (!seenD[columns[2]] | !seenP[columns[5]]) {
                console.log(` ${columns[2]}`);
                seenD[columns[2]] = true;
                seenP[columns[5]] = true;
            }
        });
    });
}


function pidPuerto(puerto) {
    const { exec } = require('child_process');
    exec(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${puerto}') do @echo %a`, (error, stdout, stderr) => {

        if (error) {
            console.error(`Error ejecutando el comando: ${error}`);
            return;
        }

        const lines = stdout.split('\n');
        console.log(`PID: ${lines[0]}`);
        matarProceso(lines[0]);
    });
}

function matarProceso(nroPid) {
    const { exec } = require('child_process');

    exec(`taskkill /PID ${nroPid} /F`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el comando: ${error}`);
            return;
        }

    });
}
