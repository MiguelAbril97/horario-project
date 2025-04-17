<template>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/login">Login</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>