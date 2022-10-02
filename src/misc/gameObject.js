import * as THREE from 'three'

// Load player mesh and settings from Sanity


// With this approach, you could hypothetically create all sorts of Battle scenarios
// and populate them... use Aliases to simulateously save assets in both Sanity and client application,
// or only save them in Sanity and be able to load them there for simple interactions
function GameObject(
    tag="", // could be maintained via Sanity
    defaultComponents=[] // could be maintained via Sanity
) {
    const gameObject = {
        tag,
        ...defaultComponents,
        addComponent: (component) => {
            Object.assign(
                gameObject,
                component(gameObject)
              )
        }
    }

    return gameObject
}

function playerHandler() {
    
}

function battleTriggerHandler(boxMesh, ) {

}

// need some kind of way to plug assets into entities

const playerComponents = [ // just input controls for now
    playerHandler,
]


// EXAMPLE MESH (The following section imitates what I'd load from GLTF)
const battleTriggerGeometry = new THREE.BoxGeometry(2, 2, 2);
const battleTriggerMaterial = new THREE.MeshNormalMaterial();
const battleTriggerMesh = new THREE.Mesh(battleTriggerGeometry, battleTriggerMaterial);

const battleTriggerBody = new CANNON.Body({
    mass: 100,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
battleTriggerBody.position.copy(boxMesh.position);

const worldBehavior = "wander"
  
const battle = {

}

const battleTriggerComponents = [ // activated via proximity trigger
    battleTriggerHandler(battleTriggerMesh,battleTriggerBody,worldBehavior,battle)
]

const interactionTriggerComponents = [ // activated via button press when within proximity

]


const player = new GameObject("Player", playerComponents)

const battleTrigger = new GameObject("BattleTrigger", battleTriggerComponents)

const interactionTrigger = newGameObject("InteractionTrigger", interactionTriggerComponents)






