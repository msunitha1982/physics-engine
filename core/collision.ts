export function detectCollisions(bodies) {
    let contacts = [];
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i];
            const b = bodies[j];
            const dx = a.position.x - b.position.x;
            const dy = a.position.y - b.position.y;
            const dz = a.position.z - b.position.z;
            const distSq = dx*dx + dy*dy + dz*dz;
            if (distSq < 1600) {
                contacts.push({ a, b, normal: { x: dx, y: dy, z: dz } });
            }
        }
    }
    return contacts;
}

export function resolveCollisions(contacts) {
    for (let c of contacts) {
        let relVel = c.a.velocity.sub(c.b.velocity);
        let norm = new Vector3(c.normal.x, c.normal.y, c.normal.z).normalize();
        let sepVel = relVel.dot(norm);
        if (sepVel < 0) {
            let impulse = norm.scale(-(1.0 + 0.7) * sepVel / (c.a.invMass + c.b.invMass));
            c.a.velocity = c.a.velocity.add(impulse.scale(c.a.invMass));
            c.b.velocity = c.b.velocity.sub(impulse.scale(c.b.invMass));
        }
    }
}
